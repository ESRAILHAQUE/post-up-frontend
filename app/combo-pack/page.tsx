import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle2, Sparkles, TrendingUp, Zap } from "lucide-react"

export default function ComboPackPage() {
  const comboPacks = [
    {
      id: "starter",
      name: "Starter Pack",
      description: "Perfect for small businesses and startups looking to build initial authority",
      posts: 5,
      avgDA: "40-50",
      price: 899,
      savings: 150,
      features: [
        "5 Guest Posts on DA 40-50 sites",
        "Mixed niche selection",
        "Standard turnaround (7-10 days)",
        "Basic reporting",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth Pack",
      description: "Ideal for growing businesses ready to scale their link building efforts",
      posts: 10,
      avgDA: "50-60",
      price: 1699,
      savings: 400,
      features: [
        "10 Guest Posts on DA 50-60 sites",
        "Niche-specific targeting",
        "Priority turnaround (5-7 days)",
        "Advanced analytics dashboard",
        "Priority email & chat support",
        "Content review included",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      description: "For established brands seeking maximum SEO impact and authority",
      posts: 20,
      avgDA: "60-70+",
      price: 3199,
      savings: 1000,
      features: [
        "20 Guest Posts on DA 60-70+ sites",
        "Premium niche selection",
        "Express turnaround (3-5 days)",
        "Dedicated account manager",
        "Custom reporting & analytics",
        "Content creation assistance",
        "Strategic placement consultation",
        "24/7 priority support",
      ],
      popular: false,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Save up to 30%
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              Combo Packs for Maximum Impact
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Bundle multiple guest posts and save big. Get better results with our curated combo packages designed for
              serious link builders.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-background border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Better Value</h3>
              <p className="text-sm text-muted-foreground">Save up to 30% compared to individual purchases</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Faster Results</h3>
              <p className="text-sm text-muted-foreground">Priority processing for all combo pack orders</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Premium Support</h3>
              <p className="text-sm text-muted-foreground">Dedicated assistance throughout your campaign</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {comboPacks.map((pack) => (
              <Card
                key={pack.id}
                className={`flex flex-col relative ${pack.popular ? "border-primary shadow-lg scale-105" : ""}`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pack.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{pack.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${pack.price}</span>
                      <span className="text-muted-foreground">one-time</span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Save ${pack.savings}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    {pack.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={pack.popular ? "default" : "outline"} asChild>
                    <Link href={`/contact?pack=${pack.id}`}>Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Pack CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <Card className="max-w-3xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Need a Custom Package?</CardTitle>
              <CardDescription className="text-base">
                Looking for something specific? We can create a custom combo pack tailored to your exact needs and
                budget.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" asChild>
                <Link href="/contact">Contact Us for Custom Quote</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
