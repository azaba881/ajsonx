import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function syncClerkUser() {
  try {
    const session = await auth();
    console.log('Clerk session:', session);

    if (!session.userId) {
      console.log('No userId found in auth()');
      return null;
    }

    // Vérifier si le plan gratuit existe
    const freePlan = await prisma.plan.findUnique({
      where: { id: 1 }
    });

    if (!freePlan) {
      console.error('Le plan gratuit n\'existe pas');
      throw new Error('Le plan gratuit n\'existe pas');
    }

    // Vérifier si l'utilisateur existe déjà
    try {
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId: session.userId },
        include: { plan: true }
      });

      if (existingUser) {
        console.log('Utilisateur existant trouvé:', existingUser);
        return existingUser;
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
      // Si la table n'existe pas ou a une structure incorrecte, on continue
    }

    // Créer un nouvel utilisateur avec le plan gratuit
    try {
      const newUser = await prisma.user.create({
        data: {
          clerkUserId: session.userId,
          planId: 1 // ID du plan gratuit
        },
        include: { plan: true }
      });

      console.log('Nouvel utilisateur créé:', newUser);
      return newUser;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    return null;
  }
} 