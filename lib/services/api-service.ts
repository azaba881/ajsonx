import { prisma } from '@/lib/prisma';
import { ApiType } from '@prisma/client';
import type { CreateApiInput, CreateEndpointInput, ApiWithEndpoints } from '../types/api';
import { syncClerkUser } from '../clerk-sync';

export class ApiService {
  static async getApis(userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return prisma.api.findMany({
      where: { userId: user.id },
      include: {
        endpoints: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async createApi(input: CreateApiInput, userId: string) {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier le nombre d'APIs de l'utilisateur
    const apiCount = await prisma.api.count({
      where: { userId: user.id }
    });

    // Vérifier la limite du plan
    const plan = await prisma.plan.findUnique({
      where: { id: user.planId }
    });

    if (plan && apiCount >= plan.apiLimit) {
      throw new Error('Limite d\'APIs atteinte pour votre plan');
    }

    // Créer l'API
    return prisma.api.create({
      data: {
        name: input.name,
        description: input.description,
        type: input.type as ApiType,
        structure: input.structure as any,
        userId: user.id
      },
      include: {
        endpoints: true
      }
    });
  }

  static async getApiById(apiId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return prisma.api.findFirst({
      where: {
        id: apiId,
        userId: user.id
      },
      include: {
        endpoints: true
      }
    });
  }

  static async getUserApis(userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return prisma.api.findMany({
      where: {
        userId: user.id
      },
      include: {
        endpoints: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async updateApi(id: string, userId: string, data: Partial<CreateApiInput>) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return prisma.api.update({
      where: {
        id,
        userId: user.id
      },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        structure: data.structure
      },
      include: {
        endpoints: true
      }
    });
  }

  static async deleteApi(id: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return prisma.api.delete({
      where: {
        id,
        userId: user.id
      }
    });
  }

  static async addEndpoint(apiId: string, userId: string, input: any) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si l'API existe et appartient à l'utilisateur
    const api = await prisma.api.findFirst({
      where: {
        id: apiId,
        userId: user.id
      }
    });

    if (!api) {
      throw new Error('API non trouvée');
    }

    // Vérifier si un endpoint avec le même chemin et méthode existe déjà
    const existingEndpoint = await prisma.apiEndpoint.findFirst({
      where: {
        apiId,
        path: input.path,
        method: input.method
      }
    });

    if (existingEndpoint) {
      throw new Error('Un endpoint avec ce chemin et cette méthode existe déjà');
    }

    // Créer l'endpoint
    return prisma.apiEndpoint.create({
      data: {
        path: input.path,
        method: input.method,
        response: input.response as any,
        apiId
      }
    });
  }

  static async deleteEndpoint(endpointId: string, userId: string) {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier que l'endpoint appartient à l'utilisateur
    const endpoint = await prisma.apiEndpoint.findFirst({
      where: {
        id: endpointId,
        api: {
          userId: user.id
        }
      }
    });

    if (!endpoint) {
      throw new Error('Endpoint non trouvé ou accès non autorisé');
    }

    return prisma.apiEndpoint.delete({
      where: {
        id: endpointId
      }
    });
  }
} 