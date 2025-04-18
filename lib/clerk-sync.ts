import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncClerkUser() {
  const session = await auth();
  
  if (!session || !session.userId) {
    return null;
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await prisma.user.findUnique({
      where: { clerkUserId: session.userId },
      include: { plan: true }
    });

    // Si l'utilisateur n'existe pas, le créer
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: session.userId,
          planId: 1, // Plan par défaut
        },
        include: { plan: true }
      });
    }

    return user;
  } catch (error) {
    console.error("Erreur lors de la synchronisation de l'utilisateur:", error);
    throw error;
  }
} 