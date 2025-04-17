import { ApiType } from '@prisma/client';

export interface ApiStructure {
  fields?: {
    [key: string]: {
      type: string;
      required?: boolean;
      description?: string;
      example?: any;
    };
  };
  relations?: {
    [key: string]: {
      type: string;
      target: string;
      description?: string;
    };
  };
  entities?: Array<{
    name: string;
    fields: {
      [key: string]: {
        type: string;
      };
    };
    relations: {
      [key: string]: {
        type: string;
        target: string;
      };
    };
  }>;
}

export interface ApiResponse {
  status: number;
  data: any;
  message?: string;
}

export interface CreateApiInput {
  name: string;
  description?: string;
  type: ApiType;
  structure: ApiStructure;
}

export interface CreateEndpointInput {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  response: ApiResponse;
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