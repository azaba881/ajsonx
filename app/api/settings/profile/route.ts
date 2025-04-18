import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { clerkUserId: session.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      bio: user.bio
    });
  } catch (error: any) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Trouver ou créer l'utilisateur dans notre base de données
    const user = await prisma.user.upsert({
      where: { clerkUserId: session.userId },
      update: {
        bio: body.bio
      },
      create: {
        clerkUserId: session.userId,
        bio: body.bio,
        planId: 1 // Plan par défaut
      }
    });

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
} 