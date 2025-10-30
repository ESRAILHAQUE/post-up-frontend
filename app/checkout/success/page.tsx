"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="container max-w-3xl py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const site = order.site;

  return (
    <div className="container max-w-3xl py-20">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Payment Successful!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your order has been confirmed and is being processed
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Confirmation</CardTitle>
            <Badge>Pending</Badge>
          </div>
          <CardDescription>
            Order ID: {order.orderId || order._id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Site Details</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              {site && (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{site.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {site.category}
                    </p>
                  </div>
                  <Badge variant="outline">
                    DA {site.domainAuthority || site.domain_authority || "N/A"}
                  </Badge>
                </div>
              )}
              {site && (
                <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Traffic:</span>
                    <span className="ml-2 font-medium">
                      {(
                        site.monthlyTraffic || site.monthly_traffic
                      )?.toLocaleString() || "N/A"}
                      /mo
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Turnaround:</span>
                    <span className="ml-2 font-medium">
                      {site.turnaroundDays || site.turnaround_days || "N/A"}{" "}
                      days
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Your Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{order.customerEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Target URL</span>
                <span className="font-medium text-primary truncate max-w-xs">
                  {order.targetUrl}
                </span>
              </div>
              {order.articleTopic && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Topic</span>
                  <span className="font-medium">{order.articleTopic}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Total Paid</span>
              <span className="text-2xl font-bold text-primary">
                ${order.totalAmount}
              </span>
            </div>
          </div>

          <Separator />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will start working on your guest post</li>
              <li>• Track your order status in your dashboard</li>
              <li>• You'll be notified when the post goes live</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href={user?.role === "admin" ? "/admin" : "/dashboard"}>
                View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 bg-transparent">
              <Link href="/sites">Browse More Sites</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <SuccessContent />
      </main>
      <SiteFooter />
    </div>
  );
}
