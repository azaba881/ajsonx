'use client';

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, GitBranch, Share2 } from "lucide-react"

export default function CreateApiPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Créer une nouvelle API</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Retour
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/create-api/simple">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <Database className="w-8 h-8 text-[#EA580C] mb-2" />
                <CardTitle>Simple API</CardTitle>
                <CardDescription>
                  Créez une API simple avec des endpoints personnalisés et une structure de données unique.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Structure de données simple</li>
                  <li>Endpoints GET, POST, PUT, DELETE</li>
                  <li>Réponses JSON personnalisées</li>
                  <li>Documentation automatique</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/create-api/related">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <GitBranch className="w-8 h-8 text-[#EA580C] mb-2" />
                <CardTitle>API avec Relations</CardTitle>
                <CardDescription>
                  Créez une API avec des entités liées et une structure de données relationnelle.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Modèle de données relationnel</li>
                  <li>Relations entre entités</li>
                  <li>CRUD complet sur chaque entité</li>
                  <li>Documentation avec schéma relationnel</li>
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
                  Créez une API GraphQL avec un schéma personnalisé et des résolveurs automatiques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Schéma GraphQL personnalisé</li>
                  <li>Résolveurs automatiques</li>
                  <li>Types et mutations</li>
                  <li>Playground intégré</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

