import { prisma } from '../lib/prisma';

async function main() {
  try {
    // Créer le plan gratuit
    await prisma.plan.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Gratuit',
        apiLimit: 5,
        price: 2000,
        features: {
          maxApis: 5,
          maxRequests: 1000,
          support: 'Email',
        },
      },
    });

    console.log('Plans initialisés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des plans:', error);
    process.exit(1);
  }
}

main(); 