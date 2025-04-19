import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ApiService } from '@/lib/services/api-service';
import type { CreateApiInput } from '@/lib/types/api';
import { ApiType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const apis = await ApiService.getApis(session.userId);
    return NextResponse.json(apis);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des APIs:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json() as CreateApiInput;
    
    // Validation basique
    if (!body.name || !body.type || !body.structure) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Validation du type d'API
    const validTypes = Object.values(ApiType);
    if (!validTypes.includes(body.type as ApiType)) {
      return NextResponse.json(
        { error: 'Type d\'API invalide' },
        { status: 400 }
      );
    }

    // Validation de la structure selon le type
    if (body.type === ApiType.RELATIONAL && (!body.structure.entities || Object.keys(body.structure.entities).length === 0)) {
      return NextResponse.json(
        { error: 'Structure invalide pour une API relationnelle' },
        { status: 400 }
      );
    }

    const api = await ApiService.createApi(body, session.userId);
    return NextResponse.json(api, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'API:', error);
    
    if (error.message.includes('Limite')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
} 