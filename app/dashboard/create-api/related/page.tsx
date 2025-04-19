"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Entity {
  name: string
  fields: {
    [key: string]: {
      type: string
    }
  }
  relations: {
    [key: string]: {
      type: "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany"
      target: string
    }
  }
}

interface Field {
  name: string
  type: string
}

interface Relation {
  name: string
  type: "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany"
  target: string
}

export default function CreateRelatedApiPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [entities, setEntities] = useState<Entity[]>([])
  const [currentEntity, setCurrentEntity] = useState("")
  const [currentField, setCurrentField] = useState<Field>({ name: "", type: "string" })
  const [currentRelation, setCurrentRelation] = useState<Relation>({
    name: "",
    type: "oneToOne",
    target: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddEntity = () => {
    if (!currentEntity.trim()) return
    
    const entityName = currentEntity.trim()
    if (entityName.includes(" ")) {
      toast({ title: "Erreur", description: "Le nom de l'entité ne doit pas contenir d'espaces", variant: "destructive" })
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(entityName)) {
      toast({ title: "Erreur", description: "Le nom de l'entité doit commencer par une lettre et ne contenir que des lettres et des chiffres", variant: "destructive" })
      return
    }
    if (entities.some(e => e.name === entityName)) {
      toast({ title: "Erreur", description: "Une entité avec ce nom existe déjà", variant: "destructive" })
      return
    }

    setEntities([
      ...entities,
      {
        name: entityName,
        fields: {},
        relations: {}
      }
    ])
    setCurrentEntity("")
  }

  const handleAddField = (entityIndex: number) => {
    if (!currentField.name.trim()) return
    
    // Validation du nom du champ
    const fieldName = currentField.name.trim()
    if (fieldName.includes(" ")) {
      toast({ title: "Erreur", description: "Le nom du champ ne doit pas contenir d'espaces", variant: "destructive" })
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(fieldName)) {
      toast({ title: "Erreur", description: "Le nom du champ doit commencer par une lettre et ne contenir que des lettres et des chiffres", variant: "destructive" })
      return
    }
    
    const entity = entities[entityIndex]
    if (entity.fields[fieldName]) {
      toast({ title: "Erreur", description: "Un champ avec ce nom existe déjà", variant: "destructive" })
      return
    }

    const updatedEntities = [...entities]
    updatedEntities[entityIndex] = {
      ...entity,
      fields: {
        ...entity.fields,
        [fieldName]: {
          type: currentField.type.toLowerCase()
        }
      }
    }
    setEntities(updatedEntities)
    setCurrentField({ name: "", type: "string" })
  }

  const handleAddRelation = (entityIndex: number) => {
    if (!currentRelation.name.trim() || !currentRelation.target) return
    
    // Validation du nom de la relation
    const relationName = currentRelation.name.trim()
    if (relationName.includes(" ")) {
      toast({ title: "Erreur", description: "Le nom de la relation ne doit pas contenir d'espaces", variant: "destructive" })
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(relationName)) {
      toast({ title: "Erreur", description: "Le nom de la relation doit commencer par une lettre et ne contenir que des lettres et des chiffres", variant: "destructive" })
      return
    }
    
    const entity = entities[entityIndex]
    if (entity.relations[relationName]) {
      toast({ title: "Erreur", description: "Une relation avec ce nom existe déjà", variant: "destructive" })
      return
    }
    if (currentRelation.target === entity.name) {
      toast({ title: "Erreur", description: "Une entité ne peut pas avoir une relation avec elle-même", variant: "destructive" })
      return
    }
    if (!entities.some(e => e.name === currentRelation.target)) {
      toast({ title: "Erreur", description: "L'entité cible n'existe pas", variant: "destructive" })
      return
    }

    const updatedEntities = [...entities]
    updatedEntities[entityIndex] = {
      ...entity,
      relations: {
        ...entity.relations,
        [relationName]: {
          type: currentRelation.type,
          target: currentRelation.target
        }
      }
    }
    setEntities(updatedEntities)
    setCurrentRelation({ name: "", type: "oneToOne", target: "" })
  }

  const handleRemoveEntity = (index: number) => {
    const entityName = entities[index].name
    const updatedEntities = entities.filter((_, i) => i !== index).map(entity => ({
      ...entity,
      relations: Object.fromEntries(
        Object.entries(entity.relations).filter(([_, rel]) => rel.target !== entityName)
      )
    }))
    setEntities(updatedEntities)
  }

  const handleRemoveField = (entityIndex: number, fieldName: string) => {
    const updatedEntities = [...entities]
    const entity = { ...entities[entityIndex] }
    const { [fieldName]: _, ...remainingFields } = entity.fields
    entity.fields = remainingFields
    updatedEntities[entityIndex] = entity
    setEntities(updatedEntities)
  }

  const handleRemoveRelation = (entityIndex: number, relationName: string) => {
    const updatedEntities = [...entities]
    const entity = { ...entities[entityIndex] }
    const { [relationName]: _, ...remainingRelations } = entity.relations
    entity.relations = remainingRelations
    updatedEntities[entityIndex] = entity
    setEntities(updatedEntities)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/apis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          type: "relational",
          schema: {
            tables: entities.map((entity) => ({
              name: entity.name,
              fields: Object.entries(entity.fields).map(([fieldName, field]) => ({
                name: fieldName,
                type: field.type,
                required: false,
              })),
              relations: Object.entries(entity.relations).map(([relationName, relation]) => ({
                targetTable: relation.target,
                type: relation.type,
                field: relationName,
              })),
            })),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create API")
      }

      const data = await response.json()
      toast({
        title: "API créée avec succès",
        description: "Votre API relationnelle a été créée avec succès.",
      })
      router.push(`/dashboard/api/${data.id}`)
    } catch (error) {
      console.error("Error creating API:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'API.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/create-api"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Créer une API avec relations</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l'API
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Mon API"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Description de l'API"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={currentEntity}
                onChange={(e) => setCurrentEntity(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md"
                placeholder="Nom de l'entité"
              />
              <button
                type="button"
                onClick={handleAddEntity}
                className="px-4 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C] flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Ajouter
              </button>
            </div>

            <div className="space-y-6">
              {entities.map((entity, entityIndex) => (
                <Card key={entity.name}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{entity.name}</CardTitle>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntity(entityIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Champs</h4>
                        <div className="flex gap-4 mb-4">
                          <input
                            type="text"
                            value={currentField.name}
                            onChange={(e) => setCurrentField({
                              ...currentField,
                              name: e.target.value
                            })}
                            className="flex-1 px-4 py-2 border rounded-md"
                            placeholder="Nom du champ"
                          />
                          <select
                            value={currentField.type}
                            onChange={(e) => setCurrentField({
                              ...currentField,
                              type: e.target.value
                            })}
                            className="px-4 py-2 border rounded-md"
                          >
                            <option value="string">String</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="date">Date</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAddField(entityIndex)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                          >
                            <Plus size={16} className="mr-2" />
                            Ajouter
                          </button>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(entity.fields).map(([fieldName, field]) => (
                            <div
                              key={fieldName}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div>
                                <span className="font-medium">{fieldName}</span>
                                <span className="text-gray-500 ml-2">{field.type}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveField(entityIndex, fieldName)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">Relations</h4>
                        <div className="flex gap-4 mb-4">
                          <input
                            type="text"
                            value={currentRelation.name}
                            onChange={(e) => setCurrentRelation({
                              ...currentRelation,
                              name: e.target.value
                            })}
                            className="flex-1 px-4 py-2 border rounded-md"
                            placeholder="Nom de la relation"
                          />
                          <select
                            value={currentRelation.type}
                            onChange={(e) => setCurrentRelation({
                              ...currentRelation,
                              type: e.target.value as any
                            })}
                            className="px-4 py-2 border rounded-md"
                          >
                            <option value="oneToOne">One to One</option>
                            <option value="oneToMany">One to Many</option>
                            <option value="manyToOne">Many to One</option>
                            <option value="manyToMany">Many to Many</option>
                          </select>
                          <select
                            value={currentRelation.target}
                            onChange={(e) => setCurrentRelation({
                              ...currentRelation,
                              target: e.target.value
                            })}
                            className="px-4 py-2 border rounded-md"
                          >
                            <option value="">Entité cible</option>
                            {entities
                              .filter(e => e.name !== entity.name)
                              .map(e => (
                                <option key={e.name} value={e.name}>
                                  {e.name}
                                </option>
                              ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAddRelation(entityIndex)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                          >
                            <Plus size={16} className="mr-2" />
                            Ajouter
                          </button>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(entity.relations).map(([relationName, relation]) => (
                            <div
                              key={relationName}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div>
                                <span className="font-medium">{relationName}</span>
                                <span className="text-gray-500 ml-2">
                                  {relation.type} → {relation.target}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveRelation(entityIndex, relationName)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C]"
          >
            Créer l'API
          </button>
        </div>
      </form>
    </div>
  )
}

