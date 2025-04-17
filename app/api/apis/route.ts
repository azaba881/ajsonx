import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ApiService } from '@/lib/services/api-service';
import type { CreateApiInput } from '@/lib/types/api';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ApiType = {
  SIMPLE: 'SIMPLE',
  RELATIONAL: 'RELATIONAL'
} as const;

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const apis = await ApiService.getUserApis(session.userId);
    return NextResponse.json(apis);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des APIs:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
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
    
    // Validation du type d'API
    if (!body.type || !Object.values(ApiType).includes(body.type)) {
      return NextResponse.json(
        { error: `Type d'API invalide. Les types valides sont: ${Object.values(ApiType).join(", ")}` },
        { status: 400 }
      );
    }

    // Validation de la structure selon le type
    if (body.type === "RELATIONAL") {
      if (!body.structure?.entities || !Array.isArray(body.structure.entities)) {
        return NextResponse.json(
          { error: "La structure doit contenir un tableau d'entités pour une API relationnelle" },
          { status: 400 }
        );
      }
    }

    const api = await ApiService.createApi(session.userId, body);
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