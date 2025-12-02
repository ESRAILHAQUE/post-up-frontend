"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileText,
  Link2,
  TrendingUp,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: "guest-posts",
      title: "Premium Guest Posts",
      description:
        "Get published on high-authority websites with proven domain authority and engaged audiences. Our curated network ensures quality backlinks that boost your SEO rankings.",
      icon: FileText,
      features: [
        "DA 30+ verified websites",
        "Dofollow backlinks",
        "Fast turnaround (5-7 days)",
        "Content review included",
        "Permanent placements",
        "Real traffic sites",
      ],
      popular: true,
    },
    {
      id: "link-insertions",
      title: "Link Insertions",
      description:
        "Insert your backlinks into existing high-quality articles on authoritative sites. Quick and effective way to build quality backlinks without creating new content.",
      icon: Link2,
      features: [
        "Existing high-DA articles",
        "Contextual placements",
        "3-5 day turnaround",
        "Dofollow links",
        "Traffic-rich pages",
        "Affordable pricing",
      ],
      popular: false,
    },
    {
      id: "seo-packages",
      title: "SEO Growth Packages",
      description:
        "Comprehensive SEO packages designed to accelerate your business growth. Multiple guest posts with strategic placement for maximum impact.",
      icon: TrendingUp,
      features: [
        "Multiple guest posts",
        "Strategic niche targeting",
        "Performance tracking",
        "Dedicated support",
        "Custom strategies",
        "Scalable solutions",
      ],
      popular: false,
    },
    {
      id: "content-syndication",
      title: "Content Syndication",
      description:
        "Amplify your existing content by syndicating it across multiple high-authority platforms. Maximize reach and build diverse backlink profiles.",
      icon: Globe,
      features: [
        "Multi-platform distribution",
        "Brand visibility boost",
        "Diverse backlink sources",
        "Content amplification",
        "Wide audience reach",
        "SEO diversification",
      ],
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Verified Quality",
      description:
        "Every site is manually vetted for domain authority, traffic quality, and editorial standards.",
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description:
        "Most posts go live within 5-7 days. Track progress in real-time through your dashboard.",
    },
    {
      icon: TrendingUp,
      title: "Real Results",
      description:
        "Build high-quality backlinks that actually improve your search rankings and drive traffic.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "Our team works with publishers to ensure your content meets quality standards and gets published.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-background py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                Our Services
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Premium Guest Posting Services
              </h1>
              <p className="text-xl text-muted-foreground">
                Boost your SEO rankings with high-quality guest posts on
                verified, high-authority websites. Get published on sites that
                drive real traffic and build lasting backlinks.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.id}
                    className={`flex flex-col hover:shadow-lg transition-all ${
                      service.popular
                        ? "border-2 border-emerald-500 relative"
                        : ""
                    }`}
                  >
                    {service.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge className="bg-emerald-500 text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className={service.popular ? "pt-6" : ""}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                          <Icon className="h-6 w-6 text-emerald-600" />
                        </div>
                        <CardTitle className="text-2xl">
                          {service.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div className="space-y-3">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                        asChild
                      >
                        <Link href="/marketplace">
                          View Options <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Our Services?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide the most trusted guest posting service for serious
                marketers looking to build quality backlinks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-emerald-100 rounded-full">
                      <Icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-emerald-600">500+</div>
                <div className="text-muted-foreground">
                  Trusted Businesses
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-emerald-600">85+</div>
                <div className="text-muted-foreground">Average DA Score</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-emerald-600">5-7</div>
                <div className="text-muted-foreground">Days Turnaround</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-emerald-50">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Boost Your SEO?
              </h2>
              <p className="text-lg text-muted-foreground">
                Start building high-quality backlinks today and watch your
                rankings soar. Browse our marketplace of verified sites.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  asChild
                >
                  <Link href="/marketplace">
                    Browse Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

