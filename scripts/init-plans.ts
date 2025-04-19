import { prisma } from '@/lib/prisma';

async function main() {
  try {
    // Supprimer tous les plans existants
    await prisma.plan.deleteMany();

    // Créer les plans
    await prisma.plan.createMany({
      data: [
        {
          name: 'Free',
          apiLimit: 1,
          price: 0,
          features: [
            'Jusqu\'à 1 API',
            '1000 requêtes/mois',
            'Support par email'
          ]
        },
        {
          name: 'Pro',
          apiLimit: 5,
          price: 2000,
          features: [
            'Jusqu\'à 5 APIs',
            '10000 requêtes/mois',
            'Support prioritaire',
            'Personnalisation avancée'
          ]
        },
        {
          name: 'Enterprise',
          apiLimit: -1, // illimité
          price: 5000,
          features: [
            'APIs illimitées',
            'Requêtes illimitées',
            'Support dédié 24/7',
            'Personnalisation complète',
            'SLA garanti'
          ]
        }
      ]
    });

    console.log('Plans initialisés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des plans:', error);
    process.exit(1);
  }
}

main(); 