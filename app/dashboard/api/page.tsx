"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Search, Filter } from "lucide-react"

interface Api {
  id: string
  name: string
  description: string
  type: "SIMPLE" | "RELATIONAL"
  endpoints: Array<{
    id: string
    path: string
    method: string
  }>
  createdAt: string
}

export default function ApiDashboardPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [apis, setApis] = useState<Api[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<"ALL" | "SIMPLE" | "RELATIONAL">("ALL")

  useEffect(() => {
    fetchApis()
  }, [])

  const fetchApis = async () => {
    try {
      setIsLoading(true)
      const token = await getToken()
      const response = await fetch("/api/apis", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des APIs")
      }

      const data = await response.json()
      setApis(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteApi = async (apiId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette API ?")) return

    try {
      const token = await getToken()
      const response = await fetch(`/api/apis/${apiId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'API")
      }

      setApis(apis.filter(api => api.id !== apiId))
      toast.success("API supprimée avec succès")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "ALL" || api.type === selectedType
    return matchesSearch && matchesType
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes APIs</h1>
        <Link
          href="/dashboard/create-api"
          className="px-4 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C] flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Créer une API
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une API..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="pl-10 pr-4 py-2 border rounded-md appearance-none bg-white"
          >
            <option value="ALL">Tous les types</option>
            <option value="SIMPLE">API Simple</option>
            <option value="RELATIONAL">API Relationnelle</option>
          </select>
        </div>
      </div>

      {filteredApis.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucune API trouvée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApis.map((api) => (
            <Card key={api.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <Link href={`/dashboard/api/${api.id}`} className="hover:text-[#EA580C]">
                    {api.name}
                  </Link>
                  <span className={`px-2 py-1 text-xs rounded ${
                    api.type === "SIMPLE" 
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {api.type === "SIMPLE" ? "Simple" : "Relationnelle"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {api.description || "Aucune description"}
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {api.endpoints.length} endpoint{api.endpoints.length !== 1 ? "s" : ""}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/api/${api.id}`}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Gérer
                    </Link>
                    <button
                      onClick={() => handleDeleteApi(api.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 