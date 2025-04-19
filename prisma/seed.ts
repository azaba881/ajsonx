import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Supprimer les plans existants
  await prisma.plan.deleteMany({})

  // Créer les plans
  const plans = [
    {
      id: 1,
      name: "Gratuit",
      price: 0,
      apiLimit: 5,
      features: [
        "5 APIs maximum",
        "Endpoints illimités",
        "Support communautaire",
        "Documentation complète"
      ],
      stripeProductId: null,
      stripePriceId: null
    },
    {
      id: 2,
      name: "Premium",
      price: 10,
      apiLimit: 10,
      features: [
        "10 APIs maximum",
        "Endpoints illimités",
        "Support prioritaire",
        "Documentation complète",
        "Personnalisation avancée"
      ],
      stripeProductId: "prod_SA013lTsncgUk5",
      stripePriceId: "price_1RFg1OCQvVrNA4QQabWl3Xym" // Vous devrez créer ce price ID dans Stripe
    },
    {
      id: 3,
      name: "Gold",
      price: 25,
      apiLimit: 25,
      features: [
        "25 APIs maximum",
        "Endpoints illimités",
        "Support dédié",
        "Documentation complète",
        "Personnalisation avancée",
        "API Analytics",
        "Accès anticipé aux nouvelles fonctionnalités"
      ],
      stripeProductId: "prod_SA03kHwX8Gl5Ut",
      stripePriceId: "price_1RFg3UCQvVrNA4QQNzllyJPn" // Vous devrez créer ce price ID dans Stripe
    }
  ]

  for (const plan of plans) {
    await prisma.plan.create({
      data: plan
    })
  }

  console.log('Base de données initialisée avec les plans')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 