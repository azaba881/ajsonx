"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Filter, MoreHorizontal, Database, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data for APIs
const mockApis = [
  {
    id: "1",
    name: "User API",
    description: "A simple user management API",
    endpoints: 4,
    createdAt: "2 days ago",
    type: "simple",
  },
  {
    id: "2",
    name: "E-commerce API",
    description: "Products, orders, and customers API",
    endpoints: 12,
    createdAt: "1 week ago",
    type: "relation",
  },
  {
    id: "3",
    name: "Blog API",
    description: "Posts, comments, and authors API",
    endpoints: 8,
    createdAt: "3 weeks ago",
    type: "relation",
  },
  {
    id: "4",
    name: "Todo API",
    description: "Simple todo management API",
    endpoints: 3,
    createdAt: "1 month ago",
    type: "simple",
  },
]

export function ApiManagement() {
  const [filter, setFilter] = useState("my-apis")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteApiId, setDeleteApiId] = useState<string | null>(null)
  const router = useRouter()

  const filteredApis = mockApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateApi = () => {
    router.push("/dashboard/create-api")
  }

  const handleViewApi = (apiId: string) => {
    router.push(`/dashboard/api/${apiId}`)
  }

  const handleDeleteApi = (apiId: string) => {
    setDeleteApiId(apiId)
  }

  const confirmDeleteApi = () => {
    // Implement API deletion logic here
    console.log(`Deleting API with id: ${deleteApiId}`)
    setDeleteApiId(null)
  }

  const handleGenerateData = async (count: number, overwrite: boolean = false) => {
    try {
      const response = await fetch(`/api/apis/${api.id}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count, overwrite }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération des données');
      }

      setMockData(data.api.mockData);
      toast.success(`Données générées avec succès (${data.operation})`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>API Management</CardTitle>
              <CardDescription>Manage and create your custom APIs</CardDescription>
            </div>
            <Button
              className="text-white bg-gradient-to-r from-[#f97316] to-[#ec4899] hover:from-[#f97316]/90 hover:to-[#ec4899]/90"
              onClick={handleCreateApi}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New API
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search APIs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="my-apis" onValueChange={setFilter}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="my-apis">My APIs</TabsTrigger>
                <TabsTrigger value="fictional-apis">Fictional APIs</TabsTrigger>
              </TabsList>

              <TabsContent value="my-apis" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredApis.map((api) => (
                    <Card key={api.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{api.name}</CardTitle>
                            <CardDescription className="line-clamp-1">{api.description}</CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewApi(api.id)}>View</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteApi(api.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{api.type === "simple" ? "Simple API" : "API with Relations"}</Badge>
                          <Badge variant="secondary">{api.endpoints} endpoints</Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between text-xs text-muted-foreground pt-2">
                        <span>Created {api.createdAt}</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => handleViewApi(api.id)}>
                          View API
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="fictional-apis" className="mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Database className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Fictional APIs</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Fictional APIs are pre-built templates you can use to quickly get started.
                  </p>
                  <Button onClick={handleCreateApi}>Browse Fictional APIs</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteApiId !== null} onOpenChange={() => setDeleteApiId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this API?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the API and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteApi} className="bg-destructive text-destructive-foreground">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Delete API
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

