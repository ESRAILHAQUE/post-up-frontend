import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { MessageCircle, Mail, Phone, Clock, Search } from "lucide-react"

export default function SupportPage() {
  const faqs = [
    {
      question: "How long does it take to get my guest post published?",
      answer:
        "Most guest posts are published within 5-7 business days. However, turnaround times vary by site and are clearly displayed on each listing. Premium and combo pack orders receive priority processing.",
    },
    {
      question: "Can I provide my own content or do you write it?",
      answer:
        "You can provide your own content or use our optional content creation service. If you provide content, please ensure it meets the quality standards of the target publication. We offer content review as part of our Growth and Enterprise combo packs.",
    },
    {
      question: "What if my guest post gets rejected?",
      answer:
        "While rare, if a post is rejected, we'll work with you to revise it or offer an alternative site of equal or higher value at no additional cost. Your satisfaction is guaranteed.",
    },
    {
      question: "Do you guarantee the links will be dofollow?",
      answer:
        "Yes, all our guest post opportunities include dofollow links unless explicitly stated otherwise in the site listing. We carefully vet each site to ensure they provide SEO value.",
    },
    {
      question: "Can I choose the anchor text for my backlink?",
      answer:
        "Yes, you can specify your preferred anchor text during checkout. However, we recommend using natural, contextual anchor text for best SEO results. Our team can provide guidance if needed.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards through our secure Stripe payment processor. All transactions are encrypted and secure.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a satisfaction guarantee. If we're unable to publish your content on the selected site, you'll receive a full refund or credit toward another site. Once published, refunds are not available as the service has been delivered.",
    },
    {
      question: "Can I track the status of my order?",
      answer:
        "Yes! You can track all your orders in real-time through your dashboard. You'll receive email notifications at each stage: order received, in progress, and published with the live link.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">How Can We Help You?</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Get answers to your questions or reach out to our support team
            </p>
            <div className="relative max-w-2xl mx-auto pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for answers..." className="pl-12 h-12 text-base" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 bg-background border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Get instant answers from our team</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Chat</Button>
                <p className="text-xs text-muted-foreground mt-2">Average response: 2 minutes</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us a detailed message</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="#contact-form">Send Email</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Speak with our team directly</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  +1 (555) 123-4567
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Mon-Fri, 9am-6pm EST</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Find quick answers to common questions</p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6 border">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      

      {/* Business Hours */}
      

      <SiteFooter />
    </div>
  )
}
