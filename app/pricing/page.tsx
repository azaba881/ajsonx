"use client"

import { useState } from "react"
import { Check, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

interface PricingFeature {
  name: string
  free: boolean | string
  pro: boolean | string
  enterprise: boolean | string
  tooltip?: string
}

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: 0,
      limit: 20,
      features: ["20 API limit", "1,000 requests per day", "Basic API types", "Community support"],
    },    
    {
      name: "Premium",
      description: "For growing projects",
      price: 5,
      limit: 100,
      features: ["100 API limit", "10,000 requests per day", "Advanced API types", "Priority support", "Custom domains"],
    },
    {
      name: "Gold",
      description: "For professional developers",
      price: 10,
      limit: "Unlimited",
      features: [
        "Unlimited APIs",
        "Unlimited requests",
        "All API types",
        "24/7 support",
        "Custom domains",
        "Team collaboration",
        "API analytics",
      ],
    },
  ]
  const { theme, setTheme } = useTheme()

    return (
      <div >
        <div className="text-center mb-4 mt-4">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our core API features.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 p-8">
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {typeof plan.limit === "number" ? `Up to ${plan.limit} APIs` : "Unlimited APIs"}
                  </p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>              
            </Card>
          ))}
        </div>
      </div>
    )
}

