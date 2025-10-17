"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  target_url: string;
  article_topic?: string;
  special_instructions?: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  completed_at?: string;
  stripe_payment_intent_id?: string;
  site: {
    id: string;
    name: string;
    category: string;
    domain_authority: number;
    monthly_traffic: number;
    turnaround_days: number;
  };
};

export default function AdminOrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${id}`);
        const orderData = response.data.data;

        // Map backend camelCase to frontend snake_case
        const mappedOrder = {
          id: orderData._id || orderData.id,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          target_url: orderData.targetUrl || "",
          article_topic: orderData.articleTopic,
          special_instructions: orderData.specialInstructions,
          status: orderData.status,
          total_amount: orderData.totalAmount,
          created_at: orderData.createdAt,
          updated_at: orderData.updatedAt,
          paid_at: orderData.paidAt,
          completed_at: orderData.completedAt,
          stripe_payment_intent_id: orderData.stripePaymentIntentId,
          site: orderData.site
            ? {
                id: orderData.site._id,
                name: orderData.site.name,
                category: orderData.site.category,
                domain_authority: orderData.site.domainAuthority,
                monthly_traffic: orderData.site.monthlyTraffic,
                turnaround_days: orderData.site.turnaroundDays,
              }
            : null,
        };

        setOrder(mappedOrder);
        setStatus(mappedOrder.status);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSave = async () => {
    if (!order) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await apiClient.put(`/orders/${order.id}`, { status });

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/orders");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-2xl py-20">
        <Alert variant="destructive">
          <AlertDescription>Order not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Order</h1>
        <p className="text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>
            Order updated successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || status === order.status}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {order.site.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{order.site.category}</Badge>
                  <Badge variant="outline">
                    DA {order.site.domain_authority}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Monthly Traffic</p>
                  <p className="font-semibold">
                    {order.site.monthly_traffic.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Turnaround</p>
                  <p className="font-semibold">
                    {order.site.turnaround_days} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Customer</p>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer_email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Target URL</p>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Order Placed</p>
                <p className="text-muted-foreground">
                  {format(new Date(order.created_at), "PPp")}
                </p>
              </div>

              {order.paid_at && (
                <div>
                  <p className="font-medium">Payment Received</p>
                  <p className="text-muted-foreground">
                    {format(new Date(order.paid_at), "PPp")}
                  </p>
                </div>
              )}

              {order.completed_at && (
                <div>
                  <p className="font-medium">Completed</p>
                  <p className="text-muted-foreground">
                    {format(new Date(order.completed_at), "PPp")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${order.total_amount}
                </span>
              </div>
              {order.stripe_payment_intent_id && (
                <p className="text-xs text-muted-foreground">
                  Payment ID: {order.stripe_payment_intent_id.slice(0, 20)}...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
