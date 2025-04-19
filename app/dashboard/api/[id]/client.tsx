"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Database, Plus, Trash2, Edit2, Copy, Wand2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Api {
  id: string
  name: string
  description: string
  type: string
  structure: any
  endpoints: Endpoint[]
  mockData?: any[]
}

interface Endpoint {
  id: string
  path: string
  method: string
  response: any
}

interface Props {
  id: string
}

export default function ApiClient({ id }: Props) {
  const router = useRouter()
  const { getToken } = useAuth()
  const [api, setApi] = useState<Api | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [count, setCount] = useState(10)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [newEndpoint, setNewEndpoint] = useState({
    path: '',
    method: 'GET',
    response: {}
  })
  const [overwriteData, setOverwriteData] = useState(true);

  useEffect(() => {
    if (id) {
      fetchApi()
    }
  }, [id])

  const fetchApi = async () => {
    try {
      setIsLoading(true)
      const token = await getToken()
      const response = await fetch(`/api/apis/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'API')
      }

      const data = await response.json()
      setApi(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddEndpoint = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = await getToken()
      const response = await fetch(`/api/apis/${id}/endpoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEndpoint)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'endpoint')
      }

      const data = await response.json()
      setApi(prev => prev ? {
        ...prev,
        endpoints: [...prev.endpoints, data]
      } : null)
      
      setNewEndpoint({
        path: '',
        method: 'GET',
        response: {}
      })
      
      toast.success('Endpoint ajouté avec succès')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteEndpoint = async (endpointId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet endpoint ?')) return

    try {
      const token = await getToken()
      const response = await fetch(`/api/apis/${id}/endpoints/${endpointId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'endpoint')
      }

      setApi(prev => prev ? {
        ...prev,
        endpoints: prev.endpoints.filter(e => e.id !== endpointId)
      } : null)
      
      toast.success('Endpoint supprimé avec succès')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const copyEndpointUrl = (path: string) => {
    const baseUrl = window.location.origin
    const fullUrl = `${baseUrl}/api/mock/${id}${path}`
    navigator.clipboard.writeText(fullUrl)
    toast.success('URL copiée dans le presse-papier')
  }

  const handleGenerateData = async () => {
    if (!api) return
    
    setIsGenerating(true)
    try {
      const token = await getToken()
      const response = await fetch(`/api/apis/${id}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          count,
          overwrite: overwriteData
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des données')
      }

      const data = await response.json()
      
      setApi(prev => prev ? {
        ...prev,
        mockData: data.api.mockData
      } : null)
      
      setShowGenerateDialog(false)
      toast.success(`${count} données générées avec succès`)
      
      await fetchApi()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  if (!api) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">API non trouvée</h1>
          <Link
            href="/dashboard/api"
            className="text-[#EA580C] hover:underline"
          >
            Retour à la liste des APIs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{api.name}</h1>
          <p className="text-gray-600">{api.description}</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Générer des données
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Générer des données fictives</DialogTitle>
              <DialogDescription>
                Choisissez le nombre de données à générer pour votre API.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nombre de données
                </label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  min={1}
                  max={1000}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="overwrite"
                  checked={overwriteData}
                  onChange={(e) => setOverwriteData(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#EA580C] focus:ring-[#EA580C]"
                />
                <label htmlFor="overwrite" className="text-sm font-medium">
                  Écraser les anciennes données
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={handleGenerateData} 
                disabled={isGenerating}
              >
                {isGenerating ? "Génération..." : "Générer"}
              </Button>
            </div>
          </DialogContent>
          </Dialog>
          
          <Link
            href="/dashboard/api"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Retour
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ajouter un endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEndpoint} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chemin
                  </label>
                  <input
                    type="text"
                    value={newEndpoint.path}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, path: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="/users"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Méthode
                  </label>
                  <select
                    value={newEndpoint.method}
                    onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C] flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter l'endpoint
                </button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              {api.endpoints.length === 0 ? (
                <p className="text-gray-500">Aucun endpoint n'a été créé</p>
              ) : (
                <div className="space-y-4">
                  {api.endpoints.map((endpoint) => (
                    <div
                      key={endpoint.id}
                      className="border rounded-md p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                              endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="font-mono">{endpoint.path}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyEndpointUrl(endpoint.path)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteEndpoint(endpoint.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Structure de l'API</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                {JSON.stringify(api.structure, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Fakes data</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              {api.mockData ? (
                <pre className="text-sm">
                  {JSON.stringify(api.mockData, null, 2)}
                </pre>
              ) : (
                <div className="text-center text-gray-500">
                  Aucune donnée générée. Utilisez le bouton "Générer des données" pour créer des données fictives.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}