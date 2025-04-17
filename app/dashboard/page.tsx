'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, GitBranch, Search, AlertCircle, Share2 } from "lucide-react";

interface ApiStructure {
  fields?: Record<string, { type: string }>
  types?: Record<string, { fields: Record<string, { type: string }> }>
  schema?: string
}

interface Api {
  id: string;
  name: string;
  description: string;
  type: 'SIMPLE' | 'GRAPHQL' | 'RELATIONAL';
  structure: ApiStructure;
  createdAt: Date;
  updatedAt: Date;
  endpoints: Array<{
    id: string;
    path: string;
    method: string;
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const [apis, setApis] = useState<Api[]>([]);
  const [filteredApis, setFilteredApis] = useState<Api[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    if (userId) {
      fetchApis();
    }
  }, [userId]);

  useEffect(() => {
    filterApis();
  }, [searchTerm, selectedType, apis]);

  const fetchApis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch('/api/apis', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la récupération des APIs');
      }

      const data = await response.json();
      setApis(data);
      setFilteredApis(data);
    } catch (error: any) {
      console.error('Erreur:', error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApis = () => {
    let filtered = [...apis];

    // Filtre par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(api => api.type === selectedType);
    }

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(api => 
        api.name.toLowerCase().includes(searchLower) ||
        api.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredApis(filtered);
  };

  const getApiIcon = (type: Api['type']) => {
    switch (type) {
      case 'SIMPLE':
        return <Database className="w-4 h-4" />;
      case 'RELATIONAL':
        return <GitBranch className="w-4 h-4" />;
      case 'GRAPHQL':
        return <Share2 className="w-4 h-4" />;
      default:
        return <Database className="text-[#EA580C]" />;
    }
  };

  const getApiTypeName = (type: Api['type']) => {
    switch (type) {
      case 'SIMPLE':
        return 'API Simple';
      case 'RELATIONAL':
        return 'API Relationnelle';
      case 'GRAPHQL':
        return 'API GraphQL';
      default:
        return 'API';
    }
  };

  const apiTypeOptions = [
    { value: 'SIMPLE', label: 'API Simple' },
    { value: 'RELATIONAL', label: 'API Relationnelle' },
    { value: 'GRAPHQL', label: 'API GraphQL' },
  ];

  if (!userId) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Non authentifié</h3>
          <p className="mt-1 text-sm text-gray-500">Veuillez vous connecter pour accéder à vos APIs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apis.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {apis.length === 0 ? 'Aucune API' : apis.length === 1 ? '1 API créée' : `${apis.length} APIs créées`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">Requêtes totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Free</div>
              <p className="text-xs text-gray-500 mt-1">25 APIs max / 1,000 reqs</p>
            </CardContent>
          </Card>
        </div>

        {/* API Management Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">API Management</h2>
            <Link
              href="/dashboard/create-api"
              className="px-4 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C]"
            >
              Create New API
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search APIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent"
            >
              <option value="all">All Types</option>
              {apiTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* APIs List */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <button
                onClick={fetchApis}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Réessayer
              </button>
            </div>
          ) : filteredApis.length === 0 ? (
            <div className="text-center py-10">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || selectedType !== 'all' ? 'Aucun résultat' : 'Aucune API'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedType !== 'all' 
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par créer votre première API'}
              </p>
              {!searchTerm && selectedType === 'all' && (
                <Link
                  href="/dashboard/create-api"
                  className="mt-4 inline-block px-4 py-2 bg-[#EA580C] text-white rounded-md hover:bg-[#C2410C]"
                >
                  Create New API
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredApis.map((api) => (
                <Card key={api.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getApiIcon(api.type)}
                        <div>
                          <CardTitle className="text-base">{api.name}</CardTitle>
                          <CardDescription>{getApiTypeName(api.type)}</CardDescription>
                        </div>
                      </div>
                      <Link
                        href={`/dashboard/api/${api.id}`}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        View API
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{api.endpoints?.length || 0} endpoints</span>
                      <span>Created {new Date(api.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

