import { ArrowRight, Gift, Heart, Shield, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function SponsorPage() {
  const sponsorTiers = [
    {
      name: "Backer",
      amount: "$5",
      period: "per month",
      description: "Support our project and get your name listed on our website.",
      benefits: ["Name on sponsors page", "Access to sponsor-only updates", "Our eternal gratitude"],
      icon: <Heart className="h-5 w-5" />,
      color: "text-pink-500",
    },
    {
      name: "Supporter",
      amount: "$25",
      period: "per month",
      description: "Get early access to new features and dedicated support.",
      benefits: ["All Backer benefits", "Early access to beta features", "Priority bug fixes", "Monthly sponsor call"],
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-500",
      popular: true,
    },
    {
      name: "Sustainer",
      amount: "$100",
      period: "per month",
      description: "Help ensure the long-term sustainability of our project.",
      benefits: [
        "All Supporter benefits",
        "Logo on our homepage",
        "Dedicated support channel",
        "Input on roadmap priorities",
        "Custom feature requests",
      ],
      icon: <Zap className="h-5 w-5" />,
      color: "text-purple-500",
    },
    {
      name: "Enterprise",
      amount: "$500+",
      period: "per month",
      description: "For companies that rely on our API for critical operations.",
      benefits: [
        "All Sustainer benefits",
        "SLA guarantees",
        "Custom development",
        "Technical consultation",
        "Co-marketing opportunities",
      ],
      icon: <Shield className="h-5 w-5" />,
      color: "text-blue-500",
    },
  ]

  const sponsors = [
    { name: "Acme Inc.", tier: "Enterprise", logo: "/placeholder.svg?height=60&width=120" },
    { name: "TechCorp", tier: "Sustainer", logo: "/placeholder.svg?height=60&width=120" },
    { name: "DevStudio", tier: "Sustainer", logo: "/placeholder.svg?height=60&width=120" },
    { name: "CodeLabs", tier: "Supporter", logo: "/placeholder.svg?height=60&width=120" },
    { name: "BuilderAI", tier: "Supporter", logo: "/placeholder.svg?height=60&width=120" },
    { name: "DataFlow", tier: "Supporter", logo: "/placeholder.svg?height=60&width=120" },
  ]

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4">
          Support Open Source
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Sponsor This Project</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Help us maintain and improve our API service by becoming a sponsor. Your support enables us to dedicate more
          time to development, documentation, and support.
        </p>
      </div>
{/* 
      <div className="mt-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold">Our Current Sponsors</h2>
          <p className="text-muted-foreground mt-2">We're grateful to these amazing sponsors who support our project</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="bg-muted rounded-md p-4 flex items-center justify-center w-full h-24">
                <img
                  src={sponsor.logo || "/placeholder.svg"}
                  alt={`${sponsor.name} logo`}
                  className="max-h-12 max-w-full"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="font-medium">{sponsor.name}</p>
                <p className="text-sm text-muted-foreground">{sponsor.tier}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      <div className="mt-10 max-w-3xl mx-auto bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg p-8 text-center"> 
        <Gift className="h-10 w-10 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold mb-2">One-time Donations</h2>
        <p className="mb-6">
          Not ready for a monthly commitment? You can also make a one-time donation to support our project.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline">$5</Button>
          <Button variant="outline">$10</Button>
          <Button variant="outline">$25</Button>
          <Button variant="outline">$50</Button>
          <Button variant="outline">$100</Button>
          <Button variant="outline">Custom</Button>
        </div>
      </div>

      <Separator className="my-16" />
    </div>
  )
}

