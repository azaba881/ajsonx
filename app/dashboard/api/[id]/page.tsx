"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock API data (replace with actual API fetch in production)
const mockApiData = {
  id: "1",
  name: "User API",
  description: "A simple user management API",
  type: "simple",
  fields: [
    { name: "id", type: "String" },
    { name: "name", type: "String" },
    { name: "email", type: "String" },
    { name: "age", type: "Number" },
  ],
  createdAt: "2023-06-01",
}

const mockApiResponse = [
  { id: "1", name: "John Doe", email: "john@example.com", age: 30 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", age: 28 },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", age: 35 },
]

export default function ApiDetailPage() {
  const params = useParams()
  const [apiData, setApiData] = useState(mockApiData)
  const [apiResponse, setApiResponse] = useState(mockApiResponse)

  useEffect(() => {
    // Fetch API data and response here
    // For now, we're using mock data
  }, [params.id])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2))
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">{apiData.name}</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Description:</strong> {apiData.description}
            </p>
            <p>
              <strong>Type:</strong> {apiData.type}
            </p>
            <p>
              <strong>Created At:</strong> {apiData.createdAt}
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="structure">
          <TabsList>
            <TabsTrigger value="structure">API Structure</TabsTrigger>
            <TabsTrigger value="response">API Response</TabsTrigger>
          </TabsList>
          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <CardTitle>API Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  <code>
                    {JSON.stringify(
                      {
                        className: apiData.name,
                        properties: apiData.fields.reduce((acc, field) => ({ ...acc, [field.name]: field.type }), {}),
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>API Response</span>
                  <Button onClick={copyToClipboard}>Copy JSON</Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <div className="font-mono mb-2">GET /api/{apiData.name.toLowerCase()}</div>
                  <pre className="overflow-auto max-h-96">
                    <code>{JSON.stringify(apiResponse, null, 2)}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

