"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Database, Plus, Trash2, Edit2, Copy, Wand2, ArrowLeft } from "lucide-react"
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
  mockData?: any
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
        throw new Error('Error during API retrieval')
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
        throw new Error('Error during endpoint addition')
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
      
      toast.success('Endpoint added successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDeleteEndpoint = async (endpointId: string) => {
    if (!confirm('Are you sure you want to delete this endpoint ?')) return

    try {
      const token = await getToken()
      const response = await fetch(`/api/apis/${id}/endpoints/${endpointId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Error during endpoint deletion')
      }

      setApi(prev => prev ? {
        ...prev,
        endpoints: prev.endpoints.filter(e => e.id !== endpointId)
      } : null)
      
      toast.success('Endpoint deleted successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const copyEndpointUrl = (path: string) => {
    const baseUrl = window.location.origin
    const fullUrl = `${baseUrl}/api/mock/${api?.id}${path.startsWith('/') ? path : `/${path}`}`
    navigator.clipboard.writeText(fullUrl)
    toast.success('URL copied to clipboard')
  }

  const getMockDataCount = (): number => {
    if (!api?.mockData) return 0
    
    if (api.type === 'SIMPLE') {
      return Array.isArray(api.mockData) ? api.mockData.length : 0
    }
    
    if (api.type === 'RELATIONAL') {
      const mockData = api.mockData as Record<string, unknown[]>;
      return Object.values(mockData)
        .reduce((total: number, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0)
    }
    
    if (api.type === 'GRAPHQL') {
      const mockData = api.mockData as { data: Record<string, unknown[]> };
      return Object.values(mockData.data || {})
        .reduce((total: number, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0)
    }
    
    return 0
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
        throw new Error('Error during data generation')
      }

      const data = await response.json()
      
      setApi(prev => prev ? {
        ...prev,
        mockData: data.api.mockData
      } : null)
      
      setShowGenerateDialog(false)
      toast.success(`${count} data generated successfully`)
      
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
          <h1 className="text-2xl font-bold mb-4">API not found</h1>
          <Link
            href="/dashboard/api"
            className="text-[#EA580C] hover:underline"
          >
            Back to the list of APIs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">{api?.name || 'Loading...'}</h1>
      </div>

      {api && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{api.endpoints.length}</div>
                <p className="text-xs text-gray-500 mt-1">Total endpoints</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Generated Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getMockDataCount()}</div>
                <p className="text-xs text-gray-500 mt-1">Total records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">API Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{api.type.toLowerCase()}</div>
                <p className="text-xs text-gray-500 mt-1">API structure type</p>
              </CardContent>
            </Card>
          </div>

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
                    Generate data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate fake data</DialogTitle>
                  <DialogDescription>
                    Choose the number of data to generate for your API.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of data
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
                      Overwrite old data
                    </label>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerateData} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generation..." : "Generate"}
                  </Button>
                </div>
              </DialogContent>
              </Dialog>
              
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-md hover:bg-gray-200"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Add an endpoint</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEndpoint} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Path
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
                        Method
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
                      Add the endpoint
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
                    <p className="text-gray-500">No endpoint has been created</p>
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
                  <CardTitle>API structure</CardTitle>
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
                      No data generated. Use the "Generate data" button to create fake data.
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}