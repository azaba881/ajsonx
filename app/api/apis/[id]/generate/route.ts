import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateDataWithGemini } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import { ApiType } from '@prisma/client';

export async function POST(
  request: NextRequest,
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return Response.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get API ID from URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const apiId = pathParts[pathParts.length - 2]; // -2 because the last part is "generate"

    // Get request body
    const body = await request.json();
    const { count = 10, overwrite = true } = body;

    // Get the API details
    const api = await prisma.api.findFirst({
      where: {
        id: apiId,
        user: {
          clerkUserId: session.userId
        }
      }
    });

    if (!api) {
      return Response.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    // Generate data
    const data = await generateDataWithGemini(api.structure, count, api.type as ApiType);

    // Save the generated data
    await prisma.api.update({
      where: { id: api.id },
      data: {
        mockData: data
      }
    });

    return Response.json({ data });
  } catch (error: any) {
    console.error('Erreur lors de la génération des données:', error);
    return Response.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}