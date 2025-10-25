"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield,
  Zap,
  Star,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Site {
  id: string;
  name: string;
  url: string;
  domain_authority: number;
  domain_rating: number;
  monthly_traffic: number;
  price: number;
  category: string;
  publishedExampleUrl: string;
  turnaround_days: number;
  is_active: boolean;
  image_url: string | null;
}

export default function HomePage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchFeaturedSites();
  }, []);

  async function fetchFeaturedSites() {
    try {
      setLoading(true);
      console.log("[Homepage] Fetching featured sites from backend...");
      const response = await apiClient.get("/sites");
      console.log("[Homepage] API Response:", response.data);

      const featuredSites = (response.data.data || [])
        .filter((site: any) => site.isActive)
        .slice(0, 6)
        .map((site: any) => ({
          id: site._id,
          name: site.name,
          url: site.url,
          domain_authority: site.domainAuthority,
          domain_rating: site.domainRating,
          monthly_traffic: site.monthlyTraffic,
          price: site.price,
          category: site.category,
          publishedExampleUrl: site.publishedExampleUrl || site.description,
          turnaround_days: site.turnaroundDays,
          is_active: site.isActive,
          image_url: site.logoUrl || null,
        }));

      console.log("[Homepage] Featured sites:", featuredSites.length);
      setSites(featuredSites);
    } catch (error: any) {
      console.error("[Homepage] Error fetching featured sites:", error);

      // Handle rate limiting error
      if (error.response?.status === 429) {
        console.warn("[Homepage] Rate limited, retrying in 5 seconds...");
        setTimeout(() => {
          fetchFeaturedSites();
        }, 5000);
        return;
      }

      setSites([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleDescription(siteId: string) {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(siteId)) {
        newSet.delete(siteId);
      } else {
        newSet.add(siteId);
      }
      return newSet;
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzktNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <Badge
                variant="secondary"
                className="mb-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                Trusted by 500+ Businesses
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Premium Guest Posts on{" "}
                <span className="text-emerald-400">High Authority Sites</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed text-pretty">
                Boost your SEO and build quality backlinks with our curated
                network of high-DA websites. Get published on authoritative
                sites in your niche.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  asChild>
                  <Link href="/auth/signup">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                  asChild>
                  <Link href="/marketplace">View Marketplace</Link>
                </Button>
              </div>

              <div className="pt-6">
                <a
                  href="https://www.trustpilot.com/review/guestpostup.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 rounded-lg px-5 py-3 border border-white/20 group">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-[#00b67a] text-[#00b67a]"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-white">
                      Excellent
                    </span>
                    <span className="text-xs text-slate-300">
                      4.8 out of 5 on Trustpilot
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            {/* Right side - Premium image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                <img
                  src="/analytics-dashboard.png"
                  alt="Guest posting analytics and growth results"
                  className="w-full h-auto"
                />
                {/* Overlay stats cards for premium feel */}
                <div className="absolute top-6 right-6 bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">
                      Traffic Growth
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">+150%</p>
                </div>
                <div className="absolute bottom-6 left-6 bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">
                      DA Score
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">85+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sites Showcase */}
      <section id="sites" className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Featured Guest Post Opportunities
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Hand-picked websites with proven authority and engaged audiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sites?.map((site) => (
              <Card
                key={site.id}
                className="flex flex-col hover:shadow-lg transition-all bg-white border-slate-200 hover:border-emerald-500">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4 mb-3">
                    {/* Logo */}
                    <div className="shrink-0">
                      {site.image_url ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white">
                          <Image
                            src={site.image_url || "/placeholder.svg"}
                            alt={`${site.name} logo`}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Name and URL */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1 truncate">
                        {site.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {site.url}
                      </p>
                    </div>
                  </div>

                  {/* Category and Authority Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {site.category}
                    </Badge>
                    <div className="flex gap-1">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                        DA {site.domain_authority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                        DR {site.domain_rating || site.domain_authority - 5}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <div className="space-y-3">
                    {/* Traffic */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Traffic</span>
                      <span className="font-semibold text-slate-900">
                        {site.monthly_traffic.toLocaleString()}/mo
                      </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Delivery</span>
                      <span className="font-semibold text-slate-900">
                        {site.turnaround_days} days
                      </span>
                    </div>

                    {/* Published Example URL */}
                    {site.publishedExampleUrl && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-700">
                          Published Example:
                        </p>
                        <div className="text-xs text-slate-600">
                          <a
                            href={site.publishedExampleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 underline break-all">
                            {site.publishedExampleUrl}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600">Price</span>
                      <span className="text-xl font-bold text-emerald-600">
                        ${site.price}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    asChild>
                    <Link href={`/checkout?site=${site.id}`}>Buy Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/marketplace">
                View All Sites <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your content published in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="font-semibold text-lg">Choose a Site</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse our curated list of high-authority websites in your niche
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="font-semibold text-lg">Place Your Order</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Provide your content details and target URL for the backlink
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="font-semibold text-lg">We Publish</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team works with publishers to get your content live
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                4
              </div>
              <h3 className="font-semibold text-lg">Track Results</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor your order status and get the published link
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose PostUp?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The most trusted guest posting service for serious marketers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verified Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Every site is manually vetted for domain authority, traffic
                  quality, and editorial standards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast Turnaround</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Most posts go live within 5-7 days. Track progress in
                  real-time through your dashboard
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Build high-quality backlinks that actually improve your search
                  rankings and drive traffic
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of satisfied customers who've boosted their SEO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2
                      key={i}
                      className="h-4 w-4 text-accent fill-accent"
                    />
                  ))}
                </div>
                <CardTitle className="text-lg">Game Changer for SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "PostUp helped us secure backlinks from sites we could never
                  reach on our own. Our organic traffic increased by 150% in 3
                  months."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sarah Mitchell</p>
                    <p className="text-xs text-muted-foreground">
                      Marketing Director, TechCo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2
                      key={i}
                      className="h-4 w-4 text-accent fill-accent"
                    />
                  ))}
                </div>
                <CardTitle className="text-lg">Exceptional Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "The quality of sites and the speed of delivery exceeded our
                  expectations. This is now our go-to for link building."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">JC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">James Chen</p>
                    <p className="text-xs text-muted-foreground">
                      SEO Manager, GrowthLabs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2
                      key={i}
                      className="h-4 w-4 text-accent fill-accent"
                    />
                  ))}
                </div>
                <CardTitle className="text-lg">Worth Every Penny</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  "We've tried other services, but PostUp's quality and
                  transparency are unmatched. Highly recommend for serious
                  marketers."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">ER</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Emily Rodriguez</p>
                    <p className="text-xs text-muted-foreground">
                      Founder, ContentScale
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our guest posting service
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    What is a guest post?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  A guest post is an article you publish on another website to
                  build backlinks, increase brand awareness, and drive traffic
                  to your site. It's one of the most effective SEO strategies
                  for improving search rankings.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    How do you verify site quality?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  We manually review every site for domain authority (DA),
                  domain rating (DR), organic traffic, spam score, and editorial
                  quality. Only sites that meet our strict criteria are added to
                  our marketplace.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    How long does it take to get published?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  <div className="pt-0 text-muted-foreground leading-relaxed pb-5">
                    Most guest posts are published within 25-30 days. The exact
                    turnaround time is listed on each site's page. You can track
                    your order status in real-time through your dashboard.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-4"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    Do you offer refunds if I'm not satisfied?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  <div className="pt-0 text-muted-foreground leading-relaxed pb-5">
                    We offer a 30-day satisfaction guarantee. If you're not
                    completely satisfied with our service, we'll work to make it
                    right or provide a full refund.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-5"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    Are the backlinks dofollow or nofollow?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  Most of our sites provide dofollow backlinks, which pass SEO
                  value to your website. The link type is clearly indicated on
                  each site's listing page before you purchase.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-6"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    Do you guarantee the guest posts will be permanent?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  <div className="pt-0 text-muted-foreground leading-relaxed pb-5">
                    Yes, all our guest posts come with a permanent placement
                    guarantee. If a post is removed within the first 12 months,
                    we'll replace it at no additional cost.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-7"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    Can I order multiple guest posts at once?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  Many of our clients order multiple guest posts across
                  different sites to build a diverse backlink profile. Contact
                  our sales team for volume discounts on bulk orders.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-8"
                className="border border-border rounded-lg px-6 bg-card">
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="text-lg font-semibold">
                    How do I get started?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  Simply browse our marketplace, select a site that matches your
                  niche, and place your order. You'll provide your content and
                  target URL during checkout. Our team handles the rest!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Boost Your SEO?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              Start building high-quality backlinks today and watch your
              rankings soar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/signup">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
