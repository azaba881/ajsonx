"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Field {
  name: string
  type: string
}

export default function CreateSimpleApiPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    fields: [] as string[]
  })
  const [apiData, setApiData] = useState({
    name: "",
    description: "",
    fields: [{ name: "", type: "string" }] as Field[]
  })

  const validateName = (name: string) => {
    if (!name) {
      setErrors(prev => ({ ...prev, name: "The name is required" }))
      return false
    }
    if (name.length < 3) {
      setErrors(prev => ({ ...prev, name: "The name must contain at least 3 characters" }))
      return false
    }
    if (!/^[A-Z][a-z0-9]*$/.test(name)) {
      setErrors(prev => ({ ...prev, name: "The name must start with a capital letter and contain only lowercase letters and numbers" }))
      return false
    }
    setErrors(prev => ({ ...prev, name: "" }))
    return true
  }

  const validateField = (field: Field, index: number) => {
    const newErrors = [...errors.fields]
    if (!field.name) {
      newErrors[index] = "The field name is required"
      setErrors(prev => ({ ...prev, fields: newErrors }))
      return false
    }
    if (!/^[a-z][a-z0-9]*$/.test(field.name)) {
      newErrors[index] = "The field name must start with a lowercase letter and contain only lowercase letters and numbers"
      setErrors(prev => ({ ...prev, fields: newErrors }))
      return false
    }
    newErrors[index] = ""
    setErrors(prev => ({ ...prev, fields: newErrors }))
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation du nom de l'API
    if (!validateName(apiData.name)) {
      toast({
        title: "Error",
        description: "The API name is invalid",
        variant: "destructive"
      })
      return
    }

    // Validation des champs
    const fieldsValid = apiData.fields.every((field, index) => validateField(field, index))
    if (!fieldsValid) {
      toast({
        title: "Error",
        description: "Some fields are invalid",
        variant: "destructive"
      })
      return
    }

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
        throw new Error("Failed to create API")
      }

      const data = await response.json()
      toast({
        title: "API created successfully",
        description: "Your simple API has been created successfully.",
      })
      router.push(`/dashboard/api/${data.id}`)
    } catch (error) {
      console.error("Error creating API:", error)
      toast({
        title: "Error",
        description: "An error occurred while creating the API.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addField = () => {
    setApiData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: "", type: "string" }]
    }))
    setErrors(prev => ({
      ...prev,
      fields: [...prev.fields, ""]
    }))
  }

  const removeField = (index: number) => {
    setApiData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
    setErrors(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const updateField = (index: number, field: Partial<Field>) => {
    setApiData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
    }))
    if (field.name !== undefined) {
      validateField({ ...apiData.fields[index], ...field }, index)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create a simple API</h1>
        <Link
          href="/dashboard/create-api"
          className="flex items-center px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:bg-gray-200"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API configuration</CardTitle>
          <CardDescription>
            Define the fields of your simple API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                API name
              </label>
              <input
                type="text"
                value={apiData.name}
                onChange={(e) => {
                  setApiData({ ...apiData, name: e.target.value })
                  validateName(e.target.value)
                }}
                className={`w-full px-4 py-2 border rounded-md ${errors.name ? 'border-red-500' : ''}`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
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
                  Fields
                </label>
                <button
                  type="button"
                  onClick={addField}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add a field
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
                        className={`w-full px-4 py-2 border rounded-md ${errors.fields[index] ? 'border-red-500' : ''}`}
                        placeholder="Field name"
                        required
                      />
                      {errors.fields[index] && (
                        <p className="text-red-500 text-sm mt-1">{errors.fields[index]}</p>
                      )}
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
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:bg-[#C2410C] disabled:opacity-50"
              >
                {isLoading ? "Creation in progress..." : "Create API"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

