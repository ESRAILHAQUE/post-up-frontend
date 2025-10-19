import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About PostUp</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We're on a mission to make high-quality guest posting accessible to businesses of all sizes
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container max-w-4xl">
            <div className="prose prose-lg max-w-none space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                PostUp was founded in 2020 by a team of SEO professionals who were frustrated with the lack of
                transparency and quality in the guest posting industry. We saw businesses struggling to build
                high-quality backlinks, wasting time and money on low-authority sites that provided little to no SEO
                value.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We decided to create a better solution. PostUp connects businesses with a curated network of
                high-authority websites, ensuring every guest post delivers real SEO value. Our rigorous vetting process
                and transparent pricing have made us the trusted choice for over 500 businesses worldwide.
              </p>

              <h2 className="text-3xl font-bold pt-8">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Quality First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We only work with websites that meet our strict quality standards for domain authority, traffic,
                      and editorial integrity.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Customer Success</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Your success is our success. We're committed to helping you achieve your SEO goals with
                      personalized support.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Transparency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      No hidden fees, no surprises. We provide clear pricing and detailed metrics for every site in our
                      network.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Results Driven</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      We focus on delivering backlinks that actually move the needle on your search rankings and organic
                      traffic.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
