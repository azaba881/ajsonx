'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

interface Type {
  name: string;
  fields: { name: string; type: string }[];
}

export default function CreateGraphqlApiPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState({
    name: '',
    description: '',
    types: [{ name: '', fields: [{ name: '', type: 'String' }] }] as Type[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      const response = await fetch('/api/apis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: apiData.name,
          description: apiData.description,
          type: 'graphql',
          structure: {
            types: apiData.types.map(type => ({
              name: type.name,
              fields: type.fields.reduce((acc, field) => ({
                ...acc,
                [field.name]: { type: field.type }
              }), {})
            }))
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error creating the API');
      }

      const data = await response.json();
      toast({
        title: "API created successfully",
        description: "Your GraphQL API has been created successfully.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error creating API:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the API.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addType = () => {
    setApiData(prev => ({
      ...prev,
      types: [...prev.types, { name: '', fields: [{ name: '', type: 'String' }] }]
    }));
  };

  const removeType = (index: number) => {
    setApiData(prev => ({
      ...prev,
      types: prev.types.filter((_, i) => i !== index)
    }));
  };

  const addField = (typeIndex: number) => {
    setApiData(prev => ({
      ...prev,
      types: prev.types.map((type, i) => 
        i === typeIndex 
          ? { ...type, fields: [...type.fields, { name: '', type: 'String' }] }
          : type
      )
    }));
  };

  const removeField = (typeIndex: number, fieldIndex: number) => {
    setApiData(prev => ({
      ...prev,
      types: prev.types.map((type, i) => 
        i === typeIndex 
          ? { ...type, fields: type.fields.filter((_, j) => j !== fieldIndex) }
          : type
      )
    }));
  };

  const updateType = (index: number, updates: Partial<Type>) => {
    setApiData(prev => ({
      ...prev,
      types: prev.types.map((type, i) => 
        i === index ? { ...type, ...updates } : type
      )
    }));
  };

  const updateField = (typeIndex: number, fieldIndex: number, updates: Partial<{ name: string; type: string }>) => {
    setApiData(prev => ({
      ...prev,
      types: prev.types.map((type, i) => 
        i === typeIndex 
          ? { 
              ...type, 
              fields: type.fields.map((field, j) => 
                j === fieldIndex ? { ...field, ...updates } : field
              )
            }
          : type
      )
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create a GraphQL API</h1>
        <Link
          href="/dashboard/create-api"
          className="flex items-center px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:bg-gray-200"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GraphQL API configuration</CardTitle>
          <CardDescription>
            Define the types and fields of your GraphQL API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                API name
              </label>
              <input
                type="text"
                value={apiData.name}
                onChange={(e) => setApiData({ ...apiData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={apiData.description}
                onChange={(e) => setApiData({ ...apiData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">
                  GraphQL types
                </label>
                <button
                  type="button"
                  onClick={addType}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  Add a type
                </button>
              </div>

              <div className="space-y-6">
                {apiData.types.map((type, typeIndex) => (
                  <Card key={typeIndex} className="border-2">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={type.name}
                          onChange={(e) => updateType(typeIndex, { name: e.target.value })}
                          className="w-full px-4 py-2 border rounded-md"
                          placeholder="Type name"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeType(typeIndex)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-4"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium">Fields</label>
                          <button
                            type="button"
                            onClick={() => addField(typeIndex)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center text-sm"
                          >
                            <Plus size={14} className="mr-1" />
                            Add a field
                          </button>
                        </div>
                        {type.fields.map((field, fieldIndex) => (
                          <div key={fieldIndex} className="flex gap-4 items-center">
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateField(typeIndex, fieldIndex, { name: e.target.value })}
                              className="flex-1 px-4 py-2 border rounded-md"
                              placeholder="Field name"
                              required
                            />
                            <select
                              value={field.type}
                              onChange={(e) => updateField(typeIndex, fieldIndex, { type: e.target.value })}
                              className="w-40 px-4 py-2 border rounded-md"
                            >
                              <option value="String">String</option>
                              <option value="Int">Int</option>
                              <option value="Float">Float</option>
                              <option value="Boolean">Boolean</option>
                              <option value="ID">ID</option>
                              {apiData.types.map((t, i) => 
                                t.name && (
                                  <option key={i} value={t.name}>
                                    {t.name}
                                  </option>
                                )
                              )}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeField(typeIndex, fieldIndex)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-md hover:opacity-90 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Creating API...' : 'Create API'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 