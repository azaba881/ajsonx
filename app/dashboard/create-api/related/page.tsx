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
  const [nameError, setNameError] = useState("")
  const [entityError, setEntityError] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [relationError, setRelationError] = useState("")

  const validateName = (value: string) => {
    if (!value) {
      setNameError("The name is required")
      return false
    }
    if (value.length < 3) {
      setNameError("The name must contain at least 3 characters")
      return false
    }
    if (!/^[A-Z][a-z0-9]*$/.test(value)) {
      setNameError("The name must start with a capital letter and contain only lowercase letters and numbers")
      return false
    }
    setNameError("")
    return true
  }

  const validateEntityName = (value: string) => {
    if (!value) {
      setEntityError("The entity name is required")
      return false
    }
    if (value.length < 3) {
      setEntityError("The entity name must contain at least 3 characters")
      return false
    }
    if (!/^[a-z][a-z0-9]*$/.test(value)) {
      setEntityError("The entity name must start with a lowercase letter and contain only lowercase letters and numbers")
      return false
    }
    if (entities.some(e => e.name === value)) {
      setEntityError("An entity with this name already exists")
      return false
    }
    setEntityError("")
    return true
  }

  const validateFieldName = (value: string, entityIndex: number) => {
    if (!value) {
      setFieldError("The field name is required")
      return false
    }
    if (value.length < 2) {
      setFieldError("The field name must contain at least 2 characters")
      return false
    }
    if (!/^[a-z][a-z0-9]*$/.test(value)) {
      setFieldError("The field name must start with a lowercase letter and contain only lowercase letters and numbers")
      return false
    }
    const entity = entities[entityIndex]
    if (entity.fields[value]) {
      setFieldError("A field with this name already exists")
      return false
    }
    setFieldError("")
    return true
  }

  const validateRelationName = (value: string, entityIndex: number) => {
    if (!value) {
      setRelationError("The relation name is required")
      return false
    }
    if (value.length < 2) {
      setRelationError("The relation name must contain at least 2 characters")
      return false
    }
    if (!/^[a-z][a-z0-9]*$/.test(value)) {
      setRelationError("The relation name must start with a lowercase letter and contain only lowercase letters and numbers")
      return false
    }
    const entity = entities[entityIndex]
    if (entity.relations[value]) {
      setRelationError("A relation with this name already exists")
      return false
    }
    setRelationError("")
    return true
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    validateName(value)
  }

  const handleAddEntity = () => {
    if (!validateEntityName(currentEntity)) return
    
    setEntities([
      ...entities,
      {
        name: currentEntity,
        fields: {},
        relations: {}
      }
    ])
    setCurrentEntity("")
  }

  const handleAddField = (entityIndex: number) => {
    if (!validateFieldName(currentField.name, entityIndex)) return
    
    const entity = entities[entityIndex]
    const updatedEntities = [...entities]
    updatedEntities[entityIndex] = {
      ...entity,
      fields: {
        ...entity.fields,
        [currentField.name]: {
          type: currentField.type.toLowerCase()
        }
      }
    }
    setEntities(updatedEntities)
    setCurrentField({ name: "", type: "string" })
  }

  const handleAddRelation = (entityIndex: number) => {
    if (!validateRelationName(currentRelation.name, entityIndex)) return
    
    const entity = entities[entityIndex]
    if (currentRelation.target === entity.name) {
      setRelationError("An entity cannot have a relation with itself")
      return
    }
    if (!entities.some(e => e.name === currentRelation.target)) {
      setRelationError("The target entity does not exist")
      return
    }

    const updatedEntities = [...entities]
    updatedEntities[entityIndex] = {
      ...entity,
      relations: {
        ...entity.relations,
        [currentRelation.name]: {
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
    if (!validateName(name)) return
    if (entities.length === 0) {
      toast({
        title: "Error",
        description: "You must create at least one entity",
        variant: "destructive"
      })
      return
    }
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
          type: "RELATIONAL",
          structure: {
            fields: entities.map((entity) => ({
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
        title: "API created successfully",
        description: "Your relational API has been created successfully.",
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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create a relational API</h1>
        <Link
          href="/dashboard/create-api"
          className="flex items-center px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:bg-gray-200"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                API name
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className={`w-full px-4 py-2 border rounded-md ${nameError ? 'border-red-500' : ''}`}
                placeholder="My API"
                required
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="API description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={currentEntity}
                onChange={(e) => setCurrentEntity(e.target.value)}
                className={`flex-1 px-4 py-2 border rounded-md ${entityError ? 'border-red-500' : ''}`}
                placeholder="Entity name"
              />
              <button
                type="button"
                onClick={handleAddEntity}
                className="px-4 py-2 bg-gray-400 text-black rounded-md hover:bg-[#C2410C] flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add
              </button>
            </div>
            {entityError && <p className="text-red-500 text-sm mb-4">{entityError}</p>}

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
                        <h4 className="font-medium mb-4">Fields</h4>
                        <div className="flex gap-4 mb-4">
                          <input
                            type="text"
                            value={currentField.name}
                            onChange={(e) => setCurrentField({
                              ...currentField,
                              name: e.target.value
                            })}
                            className={`flex-1 px-4 py-2 border rounded-md ${fieldError ? 'border-red-500' : ''}`}
                            placeholder="Field name"
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
                            Add
                          </button>
                        </div>
                        {fieldError && <p className="text-red-500 text-sm mb-4">{fieldError}</p>}
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
                            className={`flex-1 px-4 py-2 border rounded-md ${relationError ? 'border-red-500' : ''}`}
                            placeholder="Relation name"
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
                            <option value="">Target entity</option>
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
                            Add
                          </button>
                        </div>
                        {relationError && <p className="text-red-500 text-sm mb-4">{relationError}</p>}
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
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:bg-[#C2410C]"
          >
            Create API
          </button>
        </div>
      </form>
    </div>
  )
}

