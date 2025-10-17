import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockSites } from "@/lib/data/mock-data"
import Link from "next/link"

export default function SitesPage() {
  const sites = mockSites.filter((site) => site.is_active)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Browse All Sites</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Explore our complete network of high-authority guest posting opportunities
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites?.map((site) => (
                <Card key={site.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{site.category}</Badge>
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        DA {site.domain_authority}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{site.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{site.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monthly Traffic</span>
                        <span className="font-semibold">{site.monthly_traffic.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Turnaround</span>
                        <span className="font-semibold">{site.turnaround_days} days</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Price</span>
                        <span className="text-2xl font-bold text-primary">${site.price}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/checkout?site=${site.id}`}>Buy Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
