'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, GitBranch, Search, AlertCircle, Share2, Trash, Eye } from "lucide-react";

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
  mockData?: any;
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
  const { getToken, userId, isLoaded } = useAuth();
  const [apis, setApis] = useState<Api[]>([]);
  const [filteredApis, setFilteredApis] = useState<Api[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    if (isLoaded && userId) {
      const initializeData = async () => {
        try {
          const token = await getToken();
          
          // Synchroniser l'utilisateur
          const syncResponse = await fetch('/api/sync-user', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!syncResponse.ok) {
            const errorData = await syncResponse.json();
            throw new Error(errorData.error || 'Error during synchronization');
          }

          // Charger les APIs
          const apisResponse = await fetch('/api/apis', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!apisResponse.ok) {
            const errorData = await apisResponse.json();
            throw new Error(errorData.error || 'Error during API retrieval');
          }

          const data = await apisResponse.json();
          setApis(data);
          setFilteredApis(data);
        } catch (error: any) {
          console.error('Error:', error);
          setError(error.message);
          toast.error(error.message);
        } finally {
          setIsLoading(false);
        }
      };

      initializeData();
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    filterApis();
  }, [searchTerm, selectedType, apis]);

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
        return <Database className="w-6 h-6" />;
      case 'RELATIONAL':
        return <GitBranch className="w-6 h-6" />;
      case 'GRAPHQL':
        return <Share2 className="w-6 h-6" />;
      default:
        return <Database className="text-[#EA580C]" />;
    }
  };

  const getApiTypeName = (type: Api['type']) => {
    switch (type) {
      case 'SIMPLE':
        return 'Simple API';
      case 'RELATIONAL':
        return 'Relational API';
      case 'GRAPHQL':
        return 'GraphQL API';
      default:
        return 'API';
    }
  };

  const apiTypeOptions = [
    { value: 'SIMPLE', label: 'Simple API' },
    { value: 'RELATIONAL', label: 'Relational API' },
    { value: 'GRAPHQL', label: 'GraphQL API' },
  ];

  const getMockDataCount = (api: Api): number => {
    if (!api.mockData) return 0
    
    if (api.type === 'SIMPLE') {
      return Array.isArray(api.mockData) ? api.mockData.length : 0
    }
    
    if (api.type === 'RELATIONAL') {
      const mockData = api.mockData as Record<string, unknown[]>;
      return Object.values(mockData)
        .reduce((total: number, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0)
    }
    
    if (api.type === 'GRAPHQL') {
      const mockData = api.mockData as { data: Record<string, unknown[]> };
      return Object.values(mockData.data || {})
        .reduce((total: number, arr) => total + (Array.isArray(arr) ? arr.length : 0), 0)
    }
    
    return 0
  }

  if (!userId) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Not authenticated</h3>
          <p className="mt-1 text-sm text-gray-500">Please login to access your APIs.</p>
        </div>
      </div>
    );
  }

  const handleDeleteApi = async (apiId: string) => {
    if (!confirm("Are you sure you want to delete this API ?")) return

    try {
      const token = await getToken()
      const response = await fetch(`/api/apis/${apiId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Error during API deletion")
      }

      setApis(apis.filter(api => api.id !== apiId))
      toast.success("API deleted successfully")
    } catch (error: any) {
      toast.error(error.message)
    }
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
                {apis.length === 0 ? 'No API' : apis.length === 1 ? '1 API created' : `${apis.length} APIs created`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">Total requests</p>
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
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:bg-[#C2410C]"
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
                className="w-full pl-10 pr-4 py-2 rounded-md"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-md"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  filterApis();
                }}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Try again
              </button>
            </div>
          ) : filteredApis.length === 0 ? (
            <div className="text-center py-10">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm || selectedType !== 'all' ? 'No results' : 'No API'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedType !== 'all' 
                  ? 'Try to modify your filters'
                  : 'Start by creating your first API'}
              </p>
              {!searchTerm && selectedType === 'all' && (
                <Link
                  href="/dashboard/create-api"
                  className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:bg-[#C2410C]"
                >
                  Create New API
                </Link>
              )}
            </div>  
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredApis.map((api) => (
                <Card key={api.id} className="hover:shadow-lg transition-shadow hover:border-orange-400/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getApiIcon(api.type)}
                        <div>
                          <CardTitle className="text-base">{api.name}</CardTitle>
                          <CardDescription className="text-xs py-1 px-2 mt-2 bg-primary/20 rounded-md">{getApiTypeName(api.type)}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteApi(api.id)}
                          className="p-2 text-sm bg-red-400 text-white rounded-full"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <Link
                            href={`/dashboard/api/${api.id}`}
                            className="p-2 text-sm bg-blue-400 text-white rounded-full hover:bg-gray-200"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-gray-500">                   
                      <div>
                        <span className='mb-2'>{api.endpoints?.length || 0} endpoints</span><br />
                        <span>{getMockDataCount(api)} generated records</span>
                      </div>
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

