"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Field {
  name: string
  type: string
}

export default function CreateSimpleApiPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState({
    name: "",
    description: "",
    fields: [{ name: "", type: "string" }] as Field[]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = await getToken()
      const response = await fetch("/api/apis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: apiData.name,
          description: apiData.description,
          type: "SIMPLE",
          structure: {
            fields: apiData.fields.reduce((acc, field) => ({
              ...acc,
              [field.name]: { type: field.type }
            }), {})
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création de l'API")
      }

      const data = await response.json()
      toast.success("API créée avec succès")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const addField = () => {
    setApiData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: "", type: "string" }]
    }))
  }

  const removeField = (index: number) => {
    setApiData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const updateField = (index: number, field: Partial<Field>) => {
    setApiData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
    }))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Créer une API Simple</h1>
        <Link
          href="/dashboard/create-api"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Retour
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration de l'API</CardTitle>
          <CardDescription>
            Définissez les champs de votre API simple
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l'API
              </label>
              <input
                type="text"
                value={apiData.name}
                onChange={(e) => setApiData({ ...apiData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={apiData.description}
                onChange={(e) => setApiData({ ...apiData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">
                  Champs
                </label>
                <button
                  type="button"
                  onClick={addField}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Ajouter un champ
                </button>
              </div>

              <div className="space-y-4">
                {apiData.fields.map((field, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(index, { name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md"
                        placeholder="Nom du champ"
                        required
                      />
                    </div>
                    <div className="w-32">
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, { type: e.target.value })}
                        className="w-full px-4 py-2 border rounded-md"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C] disabled:opacity-50"
              >
                {isLoading ? "Création en cours..." : "Créer l'API"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

