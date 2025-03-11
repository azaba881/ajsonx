import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    limit: 20,
    features: ["20 API limit", "1,000 requests per day", "Basic API types", "Community support"],
    current: true,
  },
  {
    name: "Premium",
    description: "For growing projects",
    price: 5,
    limit: 100,
    features: ["100 API limit", "10,000 requests per day", "Advanced API types", "Priority support", "Custom domains"],
    current: false,
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
    current: false,
  },
]

export function PricingPlans() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
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
          <CardFooter>
            <Button
              className={
                plan.current
                  ? "w-full bg-primary/10 text-primary hover:bg-primary/20"
                  : "w-full bg-gradient-to-r from-[#f97316] to-[#ec4899] hover:from-[#f97316]/90 hover:to-[#ec4899]/90"
              }
              variant={plan.current ? "outline" : "default"}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

