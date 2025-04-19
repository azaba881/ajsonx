import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateDataWithGemini } from "@/lib/gemini";
import { z } from "zod";
import { ApiType } from "@prisma/client";

// Schéma de validation pour les données mock selon le type d'API
const createMockDataSchema = (type: ApiType) => {
  if (type === ApiType.SIMPLE) {
    return z.array(z.record(z.unknown()));
  } else if (type === ApiType.RELATIONAL) {
    return z.record(z.array(z.record(z.unknown())));
  } else if (type === ApiType.GRAPHQL) {
    return z.object({
      data: z.record(z.array(z.record(z.unknown())))
    });
  }
  throw new Error(`Type d'API non supporté: ${type}`);
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authentification
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Extraction des paramètres
    const { id: apiId } = params;
    const body = await request.json();
    const count = Math.min(Math.max(1, body.count || 10), 100);
    const overwrite = body.overwrite !== false; // true par défaut

    // Récupération de l'API
    const api = await prisma.api.findFirst({
      where: {
        id: apiId,
        user: {
          clerkUserId: session.userId
        }
      },
      select: {
        id: true,
        name: true,
        structure: true,
        mockData: true,
        type: true
      }
    });

    if (!api) {
      return NextResponse.json(
        { error: "API non trouvée" },
        { status: 404 }
      );
    }

    // Validation de la structure
    if (!api.structure || typeof api.structure !== "object") {
      return NextResponse.json(
        { error: "Structure d'API invalide" },
        { status: 400 }
      );
    }

    console.log(`Génération de données pour ${api.name} (${apiId}) - ${overwrite ? "Écrasement" : "Fusion"}`);

    // Génération des nouvelles données
    const newData = await generateDataWithGemini(api.structure, count, api.type);
    const mockDataSchema = createMockDataSchema(api.type);
    
    try {
      const parsedNewData = mockDataSchema.parse(newData);

      // Validation et préparation des données existantes
      const existingData = api.mockData 
        ? mockDataSchema.parse(api.mockData) 
        : (api.type === ApiType.SIMPLE ? [] : api.type === ApiType.RELATIONAL ? {} : { data: {} });

      // Fusion ou écrasement des données
      const updatedData = overwrite 
        ? parsedNewData 
        : api.type === ApiType.SIMPLE 
          ? [...existingData as any[], ...parsedNewData as any[]]
          : api.type === ApiType.RELATIONAL
            ? { ...existingData as Record<string, any[]>, ...parsedNewData as Record<string, any[]> }
            : { data: { ...(existingData as any).data, ...(parsedNewData as any).data } };

      // Mise à jour dans la base de données
      const updatedApi = await prisma.api.update({
        where: { id: apiId },
        data: { mockData: JSON.parse(JSON.stringify(updatedData)) },
        select: {
          id: true,
          name: true,
          mockData: true
        }
      });

      return NextResponse.json({
        success: true,
        operation: overwrite ? "écrasement" : "fusion",
        previousCount: api.type === ApiType.SIMPLE 
          ? (existingData as any[]).length 
          : api.type === ApiType.RELATIONAL
            ? Object.values(existingData as Record<string, any[]>).reduce((acc: number, arr) => acc + (arr as any[]).length, 0)
            : Object.values((existingData as any).data).reduce((acc: number, arr) => acc + (arr as any[]).length, 0),
        generatedCount: api.type === ApiType.SIMPLE
          ? (parsedNewData as any[]).length
          : api.type === ApiType.RELATIONAL
            ? Object.values(parsedNewData as Record<string, any[]>).reduce((acc: number, arr) => acc + (arr as any[]).length, 0)
            : Object.values((parsedNewData as any).data).reduce((acc: number, arr) => acc + (arr as any[]).length, 0),
        newCount: api.type === ApiType.SIMPLE
          ? (updatedData as any[]).length
          : api.type === ApiType.RELATIONAL
            ? Object.values(updatedData as Record<string, any[]>).reduce((acc: number, arr) => acc + (arr as any[]).length, 0)
            : Object.values((updatedData as any).data).reduce((acc: number, arr) => acc + (arr as any[]).length, 0),
        api: {
          id: updatedApi.id,
          name: updatedApi.name,
          mockData: mockDataSchema.parse(updatedApi.mockData)
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: "Format de données invalide",
            details: process.env.NODE_ENV === "development" ? error.errors : undefined
          },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Erreur dans la route API:", error);
    
    return NextResponse.json(
      { 
        error: "Erreur lors de la génération des données",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}