"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const fieldTypes = ["String", "Number", "Boolean", "Date", "Array", "Object"] as const

const formSchema = z.object({
  name: z.string().min(2, {
    message: "API name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  fields: z
    .array(
      z.object({
        name: z.string().min(1, "Field name is required"),
        type: z.enum(fieldTypes),
        example: z.string().optional(),
      }),
    )
    .min(1, "At least one field is required"),
})

export default function CreateSimpleApiPage() {
  const router = useRouter()
  const [preview, setPreview] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [{ name: "", type: "String", example: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      const previewData = {
        className: value.name,
        properties: value.fields.reduce(
          (acc, field) => {
            if (field.name) {
              acc[field.name] = field.type
            }
            return acc
          },
          {} as Record<string, string>,
        ),
      }
      setPreview(JSON.stringify(previewData, null, 2))
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Here you would typically send this data to your backend
    // For now, we'll just log it and redirect
    router.push("/dashboard")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create Simple API</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter API name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name of your API.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your API" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of what your API does.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <label className="text-sm font-medium">API Fields</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end space-x-2 mt-2">
                  <FormField
                    control={form.control}
                    name={`fields.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Field name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`fields.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fieldTypes.map((type) => (
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
                    name={`fields.${index}.example`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Example value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ name: "", type: "String", example: "" })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Field
              </Button>
            </div>
            <Button type="submit">Create API</Button>
          </form>
        </Form>
        <Card>
          <CardHeader>
            <CardTitle>API Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              <code>{preview}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

