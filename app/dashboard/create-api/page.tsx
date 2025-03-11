import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Share2 } from "lucide-react"

export default function CreateApiPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Create New API</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/dashboard/create-api/simple">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2" />
                Simple API
              </CardTitle>
              <CardDescription>Create an API without relations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Define fields freely without constraints. No management of relationships between tables.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/create-api/related">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="mr-2" />
                API with Relations
              </CardTitle>
              <CardDescription>Create an API with related tables</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Define tables and their relationships. Create APIs following the defined structure.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

