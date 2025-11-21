"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Search,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import apiClient from "@/lib/api/client";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !category ||
      !message.trim()
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields.",
      });
      return;
    }

    if (message.trim().length < 3) {
      Swal.fire({
        icon: "error",
        title: "Message Too Short",
        text: "Please provide a more detailed message (at least 3 characters).",
      });
      return;
    }

    setLoading(true);

    try {
      const ticketData = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        category,
        message: message.trim(),
      };

      const response = await apiClient.post("/support/public", ticketData);

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: `Your support ticket has been created. We'll get back to you within 24 hours at ${email}.`,
      });

      setName("");
      setEmail("");
      setSubject("");
      setCategory("");
      setMessage("");
    } catch (error: any) {
      console.error("Error creating support ticket:", error);

      let errorMessage = "Failed to submit support ticket. Please try again.";

      if (
        error.response?.data?.details &&
        Array.isArray(error.response.data.details)
      ) {
        const validationErrors = error.response.data.details
          .map((detail: any) => detail.message)
          .join(", ");
        errorMessage = `Validation Error: ${validationErrors}`;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
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
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              How Can We Help You?
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Get answers to your questions or reach out to our support team
            </p>
            <div className="relative max-w-2xl mx-auto pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                className="pl-12 h-12 text-base"
              />
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
                <CardDescription>
                  Get instant answers from our team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Chat</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Average response: 2 minutes
                </p>
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
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild>
                  <Link href="#contact-form">Send Email</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Response within 24 hours
                </p>
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
                  +1 (307) 310-4573
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Mon-Fri, 9am-6pm EST
                </p>
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
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Find quick answers to common questions
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-background rounded-lg px-6 border">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-background" id="contact-form">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={category}
                          onValueChange={setCategory}
                          required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="order">Order Issue</SelectItem>
                            <SelectItem value="payment">
                              Payment Problem
                            </SelectItem>
                            <SelectItem value="technical">
                              Technical Support
                            </SelectItem>
                            <SelectItem value="account">
                              Account Question
                            </SelectItem>
                            <SelectItem value="billing">
                              Billing Inquiry
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe your issue in detail..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        size="lg">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Contact Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Email</p>
                        <a
                          href="mailto:info@guestpostup.com"
                          className="text-sm text-primary hover:underline">
                          info@guestpostup.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          +1 (307) 310-4573
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium mb-1">
                          Response Time
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Within 24 hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      What to Expect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Fast response within 24 hours</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Dedicated support specialist</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Email updates on your ticket</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Professional service</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 bg-muted/50 border-t">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Business Hours
                </CardTitle>
                <CardDescription>
                  We're here to help during the following times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-muted-foreground">
                        9:00 AM - 6:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Saturday</span>
                      <span className="text-muted-foreground">
                        10:00 AM - 4:00 PM EST
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Sunday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-6 flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Outside business hours? No problem! Submit a ticket
                      anytime and we'll respond first thing during our next
                      business day.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-medium">Currently Available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
