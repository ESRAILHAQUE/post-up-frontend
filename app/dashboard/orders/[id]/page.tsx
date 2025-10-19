"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getOrderById, getSiteById } from "@/lib/data/mock-data";
import type { Order, Site } from "@/lib/data/mock-data";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const foundOrder = getOrderById(id);

    if (!foundOrder || foundOrder.user_id !== user.id) {
      router.push("/dashboard");
      return;
    }

    const foundSite = getSiteById(foundOrder.site_id);

    setOrder(foundOrder);
    setSite(foundSite || null);
  }, [user, id, router]);

  if (!order || !site) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statusColor =
    order.status === "completed"
      ? "default"
      : order.status === "in_progress"
      ? "secondary"
      : order.status === "cancelled"
      ? "destructive"
      : "outline";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
          <Badge variant={statusColor} className="text-sm px-3 py-1">
            {order.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{site.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {site.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{site.category}</Badge>
                      <Badge variant="outline">
                        DA {site.domain_authority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Monthly Traffic
                    </p>
                    <p className="font-semibold">
                      {site.monthly_traffic.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Turnaround Time
                    </p>
                    <p className="font-semibold">{site.turnaround_days} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Site URL
                    </p>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1">
                      Visit Site <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Target URL
                  </p>
                  <a
                    href={order.target_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1">
                    {order.target_url} <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {order.article_topic && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Article Topic
                    </p>
                    <p className="font-medium">{order.article_topic}</p>
                  </div>
                )}

                {order.special_instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Special Instructions
                    </p>
                    <p className="text-sm">{order.special_instructions}</p>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Customer Name
                    </p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Customer Email
                    </p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "PPp")}
                    </p>
                  </div>
                </div>

                {order.paid_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Payment Received</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.paid_at), "PPp")}
                      </p>
                    </div>
                  </div>
                )}

                {order.completed_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Completed</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(order.completed_at), "PPp")}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${order.total_amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${order.total_amount}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
