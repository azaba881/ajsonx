"use client"

import { useState } from "react"
import { Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ApiExample {
  title: string
  endpoint: string
  description: string
  code: string
  response: string
}

export default function ApiUsageGuide() {
  const [activeExample, setActiveExample] = useState<ApiExample | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [responseData, setResponseData] = useState<string>("")

  const apiExamples: ApiExample[] = [
    {
      title: "Get All Posts",
      endpoint: "/api/posts",
      description: "Retrieve a list of all posts from the database",
      code: `fetch('https://your-api.com/api/posts')
        .then(response => response.json())
        .then(data => console.log(data));`,
            response: `[
        {
          "id": 1,
          "title": "First Post",
          "body": "This is the content of the first post",
          "userId": 1
        },
        {
          "id": 2,
          "title": "Second Post",
          "body": "This is the content of the second post",
          "userId": 1
        }
      ]`,
    },
    {
      title: "Get Single Post",
      endpoint: "/api/posts/{id}",
      description: "Retrieve a specific post by its ID",
      code: `fetch('https://your-api.com/api/posts/1')
        .then(response => response.json())
        .then(data => console.log(data));`,
            response: `{
        "id": 1,
        "title": "First Post",
        "body": "This is the content of the first post",
        "userId": 1
      }`,
          },
          {
            title: "Create Post",
            endpoint: "/api/posts",
            description: "Create a new post with a POST request",
            code: `fetch('https://your-api.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Post',
          body: 'This is the content of the new post',
          userId: 1
        })
      })
        .then(response => response.json())
        .then(data => console.log(data));`,
            response: `{
        "id": 101,
        "title": "New Post",
        "body": "This is the content of the new post",
        "userId": 1
      }`,
    },
    {
      title: "Update Post",
      endpoint: "/api/posts/{id}",
      description: "Update an existing post with a PUT request",
      code: `fetch('https://your-api.com/api/posts/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 1,
          title: 'Updated Post',
          body: 'This is the updated content',
          userId: 1
        })
      })
        .then(response => response.json())
        .then(data => console.log(data));`,
            response: `{
        "id": 1,
        "title": "Updated Post",
        "body": "This is the updated content",
        "userId": 1
      }`,
    },
   
  ]

  const handleTryExample = (example: ApiExample) => {
    setActiveExample(example)
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setResponseData(example.response)
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Usage Guide</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn how to use our RESTful APIs to generate and manage data for your applications, similar to JSON
          Placeholder.
        </p>
      </div>

      <div className="mt-12 bg-card rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-4">
          <p>
            Our API is designed to be simple and intuitive, similar to JSON Placeholder. You can use it to prototype
            your applications or for testing purposes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>JSON Format</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  All responses are returned in JSON format and follow standard REST conventions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>CORS Enabled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Cross-Origin Resource Sharing is enabled for all origins, making it easy to use in frontend
                  applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-card rounded-lg border shadow-sm p-4">
            <h2 className="text-xl font-semibold mb-4">Available Endpoints</h2>
            <div className="space-y-2">
              {apiExamples.map((example, index) => (
                <div
                  key={index}
                  className="flex flex-col p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => handleTryExample(example)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{example.title}</span>
                    <Badge variant={example.endpoint.includes("DELETE") ? "destructive" : "outline"}>
                      {example.endpoint.includes("POST")
                        ? "POST"
                        : example.endpoint.includes("PUT")
                          ? "PUT"
                          : example.endpoint.includes("DELETE")
                            ? "DELETE"
                            : "GET"}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{example.endpoint}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {activeExample ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{activeExample.title}</span>
                  <Badge variant="outline">
                    {activeExample.endpoint.includes("POST")
                      ? "POST"
                      : activeExample.endpoint.includes("PUT")
                        ? "PUT"
                        : activeExample.endpoint.includes("DELETE")
                          ? "DELETE"
                          : "GET"}
                  </Badge>
                </CardTitle>
                <CardDescription>{activeExample.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">Code Example</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="mt-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                        <code>{activeExample.code}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          navigator.clipboard.writeText(activeExample.code)
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="response" className="mt-4">
                    <div className="relative">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                          <code>{responseData}</code>
                        </pre>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleTryExample(activeExample)} disabled={isLoading}>
                  {isLoading ? "Loading..." : "Try Again"}
                </Button>
                <Button
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={() => window.open("https://your-api.com/docs", "_blank")}
                >
                  <Code className="h-4 w-4" />
                  View Full Documentation
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg border border-dashed">
              <div className="text-center p-8">
                <Code className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select an API endpoint</h3>
                <p className="text-muted-foreground max-w-md">
                  Choose an endpoint from the list to see code examples and try out the API.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>      
    </div>
  )
}

