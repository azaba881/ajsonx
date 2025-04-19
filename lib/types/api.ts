import { ApiType } from '@prisma/client';

export interface ApiStructure {
  [key: string]: any;
  fields?: Record<string, { type: string }>;
  types?: Record<string, { fields: Record<string, { type: string }> }>;
  entities?: Record<string, { fields: Record<string, { type: string }> }>;
  relations?: {
    [key: string]: {
      type: string;
      target: string;
      description?: string;
    };
  };
}

export interface ApiResponse {
  [key: string]: any;
}

export interface CreateApiInput {
  name: string;
  description?: string;
  type: ApiType;
  structure: ApiStructure;
}

export interface CreateEndpointInput {
  path: string;
  method: string;
  response: any;
}

export interface ApiWithEndpoints {
  id: string;
  name: string;
  description: string | null;
  type: ApiType;
  structure: ApiStructure;
  mockData: any;
  endpoints: {
    id: string;
    path: string;
    method: string;
    response: ApiResponse;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 