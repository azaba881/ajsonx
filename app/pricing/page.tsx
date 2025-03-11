"use client"

import { useState } from "react"
import { Check, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface PricingFeature {
  name: string
  free: boolean | string
  pro: boolean | string
  enterprise: boolean | string
  tooltip?: string
}

export default function PricingPage() {
  const [billingAnnually, setBillingAnnually] = useState(true)

  const features: PricingFeature[] = [
    {
      name: "API Requests",
      free: "50,000/month",
      pro: "1,000,000/month",
      enterprise: "Unlimited",
      tooltip: "Number of API calls you can make per month",
    },
    {
      name: "Rate Limit",
      free: "50 req/min",
      pro: "500 req/min",
      enterprise: "Custom",
      tooltip: "Maximum number of requests per minute",
    },
    {
      name: "Data Storage",
      free: "100 MB",
      pro: "10 GB",
      enterprise: "Unlimited",
    },
    {
      name: "Custom Endpoints",
      free: false,
      pro: "Up to 10",
      enterprise: "Unlimited",
    },
    {
      name: "Webhooks",
      free: false,
      pro: true,
      enterprise: true,
    },
    {
      name: "CORS Support",
      free: true,
      pro: true,
      enterprise: true,
    },
    {
      name: "Authentication",
      free: "Basic",
      pro: "Advanced",
      enterprise: "Enterprise-grade",
      tooltip: "Security levels for API access",
    },
    {
      name: "Support",
      free: "Community",
      pro: "Email & Chat",
      enterprise: "24/7 Priority",
    },
    {
      name: "SLA",
      free: false,
      pro: "99.9% uptime",
      enterprise: "99.99% uptime",
    },
    {
      name: "Custom Domain",
      free: false,
      pro: true,
      enterprise: true,
    },
  ]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />
    }
    return <span>{value}</span>
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include access to our core API features.
        </p>

        <div className="flex items-center justify-center mt-8 space-x-2">
          <span className={!billingAnnually ? "font-medium" : "text-muted-foreground"}>Monthly</span>
          <Switch checked={billingAnnually} onCheckedChange={setBillingAnnually} id="billing-toggle" />
          <span className={billingAnnually ? "font-medium" : "text-muted-foreground"}>
            Annually
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 hover:bg-green-50">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="flex flex-col border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>For personal projects and testing</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span>{feature.name}</span>
                    {feature.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div>{renderFeatureValue(feature.free)}</div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="flex flex-col border-2 border-primary relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Badge className="px-3 py-1 text-sm">Most Popular</Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>For startups and growing businesses</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">${billingAnnually ? "79" : "99"}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            {billingAnnually && <p className="text-sm text-muted-foreground mt-1">Billed annually (${79 * 12}/year)</p>}
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span>{feature.name}</span>
                    {feature.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div>{renderFeatureValue(feature.pro)}</div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Subscribe Now</Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex flex-col border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Enterprise</CardTitle>
            <CardDescription>For large organizations and high-volume needs</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">Custom</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span>{feature.name}</span>
                    {feature.tooltip && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <div>{renderFeatureValue(feature.enterprise)}</div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

