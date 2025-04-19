import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  context: { params: Promise<{ apiId: string }> }
) {
  try {
    const params = await context.params;
    // Get the API details
    const api = await prisma.api.findUnique({
      where: { id: params.apiId }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    if (!api.mockData) {
      return NextResponse.json(
        { error: 'Aucune donnée mock disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(api.mockData);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des données mock:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ apiId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const body = await request.json();
    const { data } = body;

    // Vérifier si l'API existe et appartient à l'utilisateur
    const api = await prisma.api.findFirst({
      where: {
        id: params.apiId,
        user: {
          clerkUserId: session.userId
        }
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour les données mock
    await prisma.api.update({
      where: { id: params.apiId },
      data: {
        mockData: data as Prisma.InputJsonValue
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour des données mock:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ apiId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const body = await request.json();
    const { data } = body;

    // Vérifier si l'API existe et appartient à l'utilisateur
    const api = await prisma.api.findFirst({
      where: {
        id: params.apiId,
        user: {
          clerkUserId: session.userId
        }
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour les données mock
    await prisma.api.update({
      where: { id: params.apiId },
      data: {
        mockData: data as Prisma.InputJsonValue
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour des données mock:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ apiId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const params = await context.params;
    // Vérifier si l'API existe et appartient à l'utilisateur
    const api = await prisma.api.findFirst({
      where: {
        id: params.apiId,
        user: {
          clerkUserId: session.userId
        }
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer les données mock
    await prisma.api.update({
      where: { id: params.apiId },
      data: {
        mockData: Prisma.JsonNull
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur lors de la suppression des données mock:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
} 