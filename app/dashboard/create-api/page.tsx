'use client';

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, GitBranch, Share2 } from "lucide-react"

export default function CreateApiPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Créer une nouvelle API</h1>
          <Link
            href="/dashboard"
            className="flex items-center px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-md hover:bg-gray-200"
          >
            <ArrowLeft size={16} className="mr-1" /> Back
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/create-api/simple">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <Database className="w-8 h-8 text-[#EA580C] mb-2" />
                <CardTitle>Simple API</CardTitle>
                <CardDescription>
                  Create a simple API with custom endpoints and a unique data structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Simple data structure</li>
                  <li>GET, POST, PUT, DELETE endpoints</li>
                  <li>Custom JSON responses</li>
                  <li>Automatic documentation</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/create-api/related">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <GitBranch className="w-8 h-8 text-[#EA580C] mb-2" />
                <CardTitle>API with relations</CardTitle>
                <CardDescription>
                  Create an API with linked entities and a relational data structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Relational data model</li>
                  <li>Relations between entities</li>
                  <li>Complete CRUD on each entity</li>
                  <li>Documentation with relational schema</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/create-api/graphql">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <Share2 className="w-8 h-8 text-[#EA580C] mb-2" />
                <CardTitle>GraphQL API</CardTitle>
                <CardDescription>
                  Create a GraphQL API with a custom schema and automatic resolvers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Custom GraphQL schema</li>
                  <li>Automatic resolvers</li>
                  <li>Types and mutations</li>
                  <li>Integrated playground</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

