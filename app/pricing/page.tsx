"use client"

import { useState } from "react"
import { Check, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CheckCircle } from "lucide-react"
import { handleUpgrade } from "@/app/actions/upgrade"
import { useToast } from "@/hooks/use-toast"

interface PricingFeature {
  name: string
  free: boolean | string
  pro: boolean | string
  enterprise: boolean | string
  tooltip?: string
}

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
    buttonText: "Commencer gratuitement",
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
    buttonText: "Commencer l'essai",
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
    buttonText: "Commencer l'essai",
    buttonVariant: "default" as const,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handlePlanSelection = async (planId: number) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tarification simple et transparente</h1>
        <p className="text-xl text-muted-foreground">
          Choisissez le plan qui correspond à vos besoins
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className="p-6">
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
              onClick={() => handlePlanSelection(plan.id)}
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

