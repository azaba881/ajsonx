"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import { handleUpgrade } from "@/app/actions/upgrade"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const pricingPlans = [
  {
    id: 1,
    name: "Gratuit",
    price: 0,
    features: [
      "5 APIs maximum",
      "Endpoints illimités",
      "Support communautaire",
      "Documentation complète",
    ],
    apiLimit: 5,
    buttonText: "Plan actuel",
    buttonVariant: "outline" as const,
  },
  {
    id: 2,
    name: "Premium",
    price: 10,
    features: [
      "10 APIs maximum",
      "Endpoints illimités",
      "Support prioritaire",
      "Documentation complète",
      "Personnalisation avancée",
    ],
    apiLimit: 10,
    buttonText: "Passer au Premium",
    buttonVariant: "default" as const,
  },
  {
    id: 3,
    name: "Gold",
    price: 25,
    features: [
      "25 APIs maximum",
      "Endpoints illimités",
      "Support dédié",
      "Documentation complète",
      "Personnalisation avancée",
      "API Analytics",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
    apiLimit: 25,
    buttonText: "Passer au Gold",
    buttonVariant: "default" as const,
  },
]

export default function DashboardPricingPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const { toast } = useToast();

  const handleUpgradeClick = async (planId: number) => {
    try {
      setLoading(planId);
      const result = await handleUpgrade(planId);
      
      if (result?.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à niveau",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-2 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Mettez à niveau votre plan</h1>
        <p className="text-xl text-muted-foreground">
          Débloquez plus de fonctionnalités avec nos plans premium
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className="p-6 relative">
            {plan.id === 2 && (
              <Badge 
                className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                variant="default"
              >
                Populaire
              </Badge>
            )}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.buttonVariant}
              onClick={() => handleUpgradeClick(plan.id)}
              disabled={loading === plan.id}
            >
              {loading === plan.id ? "Chargement..." : plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

