"use client";

import type React from "react";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Send,
  Mail,
  MessageSquare,
  Loader2,
  BookOpen,
  FileText,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";

export default function SupportPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to submit a support ticket.",
      });
      return;
    }

    if (!subject.trim() || !category || !message.trim()) {
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
        subject: subject.trim(),
        category,
        message: message.trim(),
      };

      console.log("[Support] Sending ticket data:", ticketData);

      const response = await apiClient.post("/support", ticketData);

      console.log("Support ticket created:", response.data);

      Swal.fire({
        icon: "success",
        title: "Ticket Submitted!",
        text: `Your support ticket has been created with ID: ${response.data.data.ticketId}. We'll get back to you within 24 hours.`,
      });

      setSubject("");
      setCategory("");
      setMessage("");
    } catch (error: any) {
      console.error("Error creating support ticket:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Failed to submit support ticket. Please try again.";

      if (
        error.response?.data?.details &&
        Array.isArray(error.response.data.details)
      ) {
        // Handle validation errors
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

  const quickHelpCategories = [
    {
      icon: FileText,
      title: "Order Status",
      description: "Track your guest post orders",
      action: "View Orders",
      href: "/dashboard/my-orders",
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Browse our help articles",
      action: "Read Docs",
      href: "/blog",
    },
    {
      icon: MessageSquare,
      title: "My Tickets",
      description: "View your support tickets",
      action: "View Tickets",
      href: "/dashboard/support/tickets",
    },
  ];

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="text-center space-y-3 py-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant answers or reach out to our support team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickHelpCategories.map((category) => (
            <Card
              key={category.title}
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-full">
                    <category.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    onClick={() => {
                      if (category.href.startsWith("#")) {
                        document
                          .querySelector(category.href)
                          ?.scrollIntoView({ behavior: "smooth" });
                      } else {
                        window.location.href = category.href;
                      }
                    }}>
                    {category.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 text-2xl">
              <HelpCircle className="h-6 w-6 text-emerald-600" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-gray-600">
              Find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-gray-200">
                <AccordionTrigger className="text-gray-900 hover:text-emerald-600 text-left">
                  How long does it take to publish a guest post?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Typically 5-7 business days from order confirmation. You'll
                  receive updates via email as your order progresses through our
                  review and publishing process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-gray-200">
                <AccordionTrigger className="text-gray-900 hover:text-emerald-600 text-left">
                  Can I request revisions to my guest post?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes! We offer one free revision per order to ensure your
                  complete satisfaction. Additional revisions may incur extra
                  charges depending on the scope of changes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-gray-200">
                <AccordionTrigger className="text-gray-900 hover:text-emerald-600 text-left">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We accept all major credit cards (Visa, Mastercard, American
                  Express, Discover) through our secure Stripe payment gateway.
                  All transactions are encrypted and secure.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-gray-200">
                <AccordionTrigger className="text-gray-900 hover:text-emerald-600 text-left">
                  Do you offer refunds?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Refunds are available if we cannot fulfill your order within
                  the agreed timeframe. Once a post is published, refunds are
                  not available, but we'll work with you to ensure complete
                  satisfaction with revisions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-gray-200">
                <AccordionTrigger className="text-gray-900 hover:text-emerald-600 text-left">
                  How do I track my order status?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  You can track your order status in real-time from your
                  dashboard. Navigate to "My Orders" to see detailed progress
                  updates, estimated completion dates, and any action items that
                  require your attention.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="border-gray-200">
                <AccordionTrigger className="text-gray-900 hover:text-emerald-600 text-left">
                  What if I need to cancel my order?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Orders can be cancelled within 24 hours of placement for a
                  full refund. After work has begun, cancellation fees may apply
                  based on the progress made. Contact our support team to
                  discuss your specific situation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          id="contact-form">
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 text-2xl">
                  <MessageSquare className="h-6 w-6 text-emerald-600" />
                  Submit a Support Ticket
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Can't find what you're looking for? Send us a message and
                  we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-gray-700 font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                      className="bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-gray-700 font-medium">
                      Category *
                    </Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required>
                      <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Order Issue</SelectItem>
                        <SelectItem value="payment">Payment Problem</SelectItem>
                        <SelectItem value="technical">
                          Technical Support
                        </SelectItem>
                        <SelectItem value="account">
                          Account Question
                        </SelectItem>
                        <SelectItem value="billing">Billing Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-gray-700 font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue in detail. Include any relevant order numbers or error messages..."
                      rows={8}
                      required
                      className="bg-white border-gray-300 text-gray-900 resize-none focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Email Support
                    </p>
                    <a
                      href="mailto:support@guestpostup.com"
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                      support@guestpostup.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Response Time
                    </p>
                    <p className="text-sm text-gray-600">
                      Within 24 hours (Mon-Fri)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Business Hours
                    </p>
                    <p className="text-sm text-gray-600">
                      9:00 AM - 6:00 PM EST
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Location
                    </p>
                    <p className="text-sm text-gray-600">United States</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Fast response within 24 hours
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Dedicated support specialist
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Email updates on your ticket
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    Professional and friendly service
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
