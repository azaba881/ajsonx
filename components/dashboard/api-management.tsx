"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Filter, MoreHorizontal, Database, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { mockApis } from "@/lib/data"

interface Api {
  id: string;
  name: string;
  description: string;
  type: string;
  mockData?: any;
}

export function ApiManagement() {
  const [filter, setFilter] = useState("my-apis")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteApiId, setDeleteApiId] = useState<string | null>(null)
  const [selectedApi, setSelectedApi] = useState<Api | null>(null)
  const router = useRouter()
  const { toast } = useToast()

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
    if (!selectedApi) {
      toast({
        title: "Error",
        description: "No API selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/apis/${selectedApi.id}/generate`, {
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

      toast({
        title: "Success",
        description: `Données générées avec succès (${data.operation})`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Input
            placeholder="Search APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={handleCreateApi}>Create New API</Button>
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="my-apis">My APIs</TabsTrigger>
            <TabsTrigger value="public-apis">Public APIs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApis.map((api) => (
          <Card key={api.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{api.name}</CardTitle>
              <CardDescription>{api.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => handleViewApi(api.id)}>
                  View Details
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteApi(api.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!deleteApiId} onOpenChange={() => setDeleteApiId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDeleteApiId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteApi}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

