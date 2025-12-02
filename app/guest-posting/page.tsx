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
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter Package",
      price: 297,
      originalPrice: 497,
      quantity: "5 Guest Posts",
      features: [
        "5 High-Quality Guest Posts",
        "DA 40-50 websites",
        "Basic SEO optimization",
        "1 revision per article",
        "7-10 day delivery",
        "General topics",
      ],
      popular: false,
      packageId: "starter-growth-package", // This will be used for checkout
    },
    {
      id: "professional",
      name: "Professional Package",
      price: 697,
      originalPrice: 997,
      quantity: "15 Guest Posts",
      features: [
        "15 Premium Guest Posts",
        "DA 50-60 websites",
        "Advanced SEO optimization",
        "2 revisions per article",
        "5-7 day delivery",
        "Industry-specific content",
        "Content review included",
      ],
      popular: true,
      packageId: "professional-growth-package",
    },
    {
      id: "enterprise",
      name: "Enterprise Package",
      price: 1497,
      originalPrice: 2497,
      quantity: "30 Guest Posts",
      features: [
        "30 Premium Guest Posts",
        "DA 60-70+ websites",
        "Premium SEO optimization",
        "Unlimited revisions",
        "3-5 day delivery",
        "Content strategy consultation",
        "Priority support",
      ],
      popular: false,
      packageId: "enterprise-growth-package",
    },
  ];

  const processSteps = [
    {
      number: 1,
      title: "Research",
      description: "In-depth keyword & topic research",
    },
    {
      number: 2,
      title: "Outline",
      description: "Strategic content structure",
    },
    {
      number: 3,
      title: "Write",
      description: "Expert content creation",
    },
    {
      number: 4,
      title: "Optimize",
      description: "SEO & quality review",
    },
  ];

  const handleOrderNow = (packageId: string) => {
    router.push(`/checkout?package=${packageId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50 to-background py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Premium Guest Posting Services
              </h1>
              <p className="text-xl text-slate-600">
                High-quality, SEO-optimized guest posts that rank and convert.
                Get published on verified high-authority websites.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section className="py-10 bg-background">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What's Included
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our expert team crafts compelling, keyword-optimized guest posts
              that improve your search rankings while engaging your audience.
              Each article undergoes rigorous research, strategic keyword
              placement, and SEO best practices to ensure maximum visibility and
              permanent backlinks on high-authority websites.
            </p>
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="py-10 bg-muted/50">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why It Matters
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Quality guest posting is the foundation of successful SEO. Search
              engines reward websites with valuable, original content from
              authoritative sources, and it keeps your audience coming back.
              Fresh, well-researched guest posts establish authority in your
              niche by establishing yourself as a thought leader and driving
              organic traffic through high-quality backlinks.
            </p>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-10 bg-background">
          <div className="container max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Key Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Improved search rankings & keyword research
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Increased organic traffic and visibility
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Higher audience engagement and time-on-page
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Established industry authority
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Long-term SEO benefits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Professional quality guaranteed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps Section */}
        <section className="py-10 bg-muted/50">
          <div className="container max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Our Guest Posting Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {processSteps.map((step) => {
                return (
                  <Card key={step.number} className="text-center border-slate-200 shadow-sm">
                    <CardHeader className=" pt-2">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                          {step.number}
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-900">
                          {step.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="py-12 bg-background">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Pricing Plans
              </h2>
              <p className="text-lg text-slate-600">
                Choose the perfect package for your content needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`flex flex-col ${
                    plan.popular
                      ? "border-2 border-emerald-500 relative shadow-lg"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-emerald-500 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={plan.popular ? "pt-6" : ""}>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-400 line-through">
                          ${plan.originalPrice}
                        </span>
                        <span className="text-4xl font-bold text-emerald-600">
                          ${plan.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.quantity}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      } text-white`}
                      onClick={() => handleOrderNow(plan.packageId)}
                    >
                      Order Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
