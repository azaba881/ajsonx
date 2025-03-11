"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Plus, X, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const relationTypes = ["OneToOne", "OneToMany", "ManyToMany"] as const

const tableSchema = z.object({
  name: z.string().min(1, "Table name is required"),
})

const relationSchema = z.object({
  source: z.string().min(1, "Source table is required"),
  type: z.enum(relationTypes),
  target: z.string().min(1, "Target table is required"),
})

const formSchema = z.object({
  tables: z.array(tableSchema).min(1, "At least one table is required"),
  relations: z.array(relationSchema),
})

export default function CreateRelatedApiPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tables: [{ name: "" }],
      relations: [],
    },
  })

  const {
    fields: tables,
    append: appendTable,
    remove: removeTable,
  } = useFieldArray({
    control: form.control,
    name: "tables",
  })

  const {
    fields: relations,
    append: appendRelation,
    remove: removeRelation,
  } = useFieldArray({
    control: form.control,
    name: "relations",
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send this data to your backend
    // For now, we'll just log it and redirect
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create API with Relations</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 1: Define Tables</h2>
              {tables.map((table, index) => (
                <div key={table.id} className="flex items-center space-x-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`tables.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Table name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeTable(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendTable({ name: "" })}>
                <Plus className="mr-2 h-4 w-4" /> Add Table
              </Button>
              <Button type="button" className="ml-2" onClick={() => setStep(2)}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 2: Define Relations</h2>
              {relations.map((relation, index) => (
                <div key={relation.id} className="flex items-end space-x-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`relations.${index}.source`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Source table" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem key={table.id} value={table.name || `table-${table.id}`}>
                                {table.name || `Table ${index + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`relations.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Relation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`relations.${index}.target`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Target table" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tables.map((table) => (
                              <SelectItem key={table.id} value={table.name || `table-${table.id}`}>
                                {table.name || `Table ${index + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeRelation(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendRelation({ source: "", type: "OneToOne", target: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Relation
              </Button>
              <Button type="button" className="ml-2" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="ml-2">
                Create APIs
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}

