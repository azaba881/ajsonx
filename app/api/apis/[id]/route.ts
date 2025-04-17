import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ApiService } from '@/lib/services/api-service';
import type { CreateApiInput } from '@/lib/types/api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const apiId = params.id;
    const api = await ApiService.getApiById(apiId, session.userId);
    
    if (!api) {
      return NextResponse.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(api);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const apiId = params.id;
    const body = await request.json() as Partial<CreateApiInput>;
    const { name, description, structure } = body;

    if (!name || !structure) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    const updatedApi = await ApiService.updateApi(apiId, session.userId, {
      name,
      description,
      structure
    });
    
    if (!updatedApi) {
      return NextResponse.json(
        { error: 'API non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedApi);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const apiId = params.id;
    await ApiService.deleteApi(apiId, session.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
} 