import { PricingPlans } from "@/components/dashboard/pricing-plans"

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-muted-foreground">Choose the right plan for your API needs</p>
      <PricingPlans />
    </div>
  )
}

