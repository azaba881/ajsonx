import { prisma } from "./prisma";

export async function ensureDefaultPlansExist() {
  const plansCount = await prisma.plan.count();
  
  if (plansCount === 0) {
    await prisma.plan.createMany({
      data: [
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
          ]
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
          stripePriceId: "price_1RFg7sCQvVrNA4QQL5bvO3eE"
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
          stripePriceId: "price_1RFg8MCQvVrNA4QQbO3eEL5"
        }
      ]
    });
  }
} 