"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import apiClient from "@/lib/api/client"

type Site = {
  _id: string
  name: string
  url: string
  description?: string
  category: string
  domainAuthority: number
  monthlyTraffic: number
  price: number
  turnaroundDays: number
  logoUrl?: string
  isFeatured?: boolean
  isActive?: boolean
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await apiClient.get("/sites", { params: { page: 1, limit: 30, isActive: true } })
        const data = res.data?.data?.items || res.data?.data || []
        setSites(data)
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load sites")
      } finally {
        setLoading(false)
      }
    }
    fetchSites()
  }, [])

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
            {loading ? (
              <div className="text-center py-10 text-muted-foreground">Loading sites…</div>
            ) : error ? (
              <div className="text-center py-10 text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site) => (
                  <Card key={site._id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{site.category}</Badge>
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          DA {site.domainAuthority}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{site.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{site.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Monthly Traffic</span>
                          <span className="font-semibold">{Number(site.monthlyTraffic || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Turnaround</span>
                          <span className="font-semibold">{site.turnaroundDays} days</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-muted-foreground">Price</span>
                          <span className="text-2xl font-bold text-primary">${site.price}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" asChild>
                        <Link href={`/checkout?site=${site._id}`}>Buy Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
