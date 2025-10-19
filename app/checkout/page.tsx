"use client";

import type React from "react";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth/auth-context";
import apiClient from "@/lib/api/client";
import { getSiteById } from "@/lib/data/mock-data";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Check } from "lucide-react";

type Site = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  domain_authority: number;
  monthly_traffic: number;
  price: number;
  turnaround_days: number;
  logo_url?: string;
  featured: boolean;
};

type Package = {
  _id: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  features: string[];
  category: string;
  isActive: boolean;
  imageUrl?: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({
  item,
  itemType,
  clientSecret,
}: {
  item: Site | Package;
  itemType: "site" | "package";
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [articleTopic, setArticleTopic] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name || "");
    }
  }, [user]);

  const getPrice = () => {
    if (itemType === "package") {
      return (item as Package).discounted_price;
    }
    return (item as Site).price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment(
        {
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
          redirect: "if_required",
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const userId = user?.id || "guest";
        const price = getPrice();

        // Create order in backend
        const orderData: any = {
          userId: userId,
          orderType: itemType,
          customerName: name,
          customerEmail: email,
          totalAmount: price,
          stripePaymentIntentId: paymentIntent.id,
          paymentStatus: "pending",
          status: "pending",
        };

        // Add type-specific fields
        if (itemType === "package") {
          orderData.packageId = (item as any)._id || item.id;
        } else {
          orderData.siteId = (item as any)._id || item.id;
          orderData.targetUrl = targetUrl;
          orderData.articleTopic = articleTopic || undefined;
          orderData.specialInstructions = specialInstructions || undefined;
        }

        const orderResponse = await apiClient.post("/orders", orderData);
        const order = orderResponse.data.data;

        // Confirm payment in backend (this will update payment status and create invoice)
        await apiClient.post("/payments/confirm", {
          paymentIntentId: paymentIntent.id,
        });

        // Redirect to success page
        router.push(`/checkout/success?order=${order._id}`);
      }
    } catch (err: any) {
      console.error("[v0] Checkout error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {itemType === "package" ? "Package Details" : "Order Details"}
        </h3>

        {itemType === "site" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="targetUrl">Target URL (for backlink) *</Label>
              <Input
                id="targetUrl"
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://yourwebsite.com/page"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                The URL you want the guest post to link to
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="articleTopic">Article Topic (Optional)</Label>
              <Input
                id="articleTopic"
                value={articleTopic}
                onChange={(e) => setArticleTopic(e.target.value)}
                placeholder="e.g., Best SEO Practices for 2025"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialInstructions">
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any specific requirements or preferences..."
                rows={4}
                disabled={loading}
              />
            </div>
          </>
        )}

        {itemType === "package" && (
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Any specific requirements or preferences for your package order..."
              rows={4}
              disabled={loading}
            />
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Payment Information</h3>
        <PaymentElement />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={!stripe || loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${getPrice()}`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By completing this purchase, you agree to our Terms of Service and
        Privacy Policy
      </p>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const siteId = searchParams.get("site");
  const packageId = searchParams.get("package");

  const [item, setItem] = useState<Site | Package | null>(null);
  const [itemType, setItemType] = useState<"site" | "package">("site");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCheckout = async () => {
      if (!siteId && !packageId) {
        setError("No item selected");
        setLoading(false);
        return;
      }

      try {
        let itemData: Site | Package | undefined;
        let type: "site" | "package" = "site";
        let price = 0;

        if (packageId) {
          // Fetch package from backend
          const response = await apiClient.get(`/packages/${packageId}`);
          itemData = response.data.data;
          type = "package";
          if (itemData) {
            price = (itemData as Package).discounted_price;
          }
        } else if (siteId) {
          // Fetch site from backend
          try {
            const response = await apiClient.get(`/sites/${siteId}`);
            const siteData = response.data.data;
            // Map backend camelCase to frontend snake_case
            itemData = {
              id: siteData._id,
              name: siteData.name,
              url: siteData.url,
              description: siteData.description || "",
              category: siteData.category,
              domain_authority: siteData.domainAuthority,
              monthly_traffic: siteData.monthlyTraffic,
              price: siteData.price,
              turnaround_days: siteData.turnaroundDays,
              logo_url: siteData.logoUrl,
              featured: siteData.isFeatured || false,
            } as Site;
            type = "site";
            if (itemData) {
              price = (itemData as Site).price;
            }
          } catch (siteError) {
            console.error("[v0] Site fetch error:", siteError);
            throw new Error(
              "Site not found. Please select a site from the marketplace."
            );
          }
        }

        if (!itemData) {
          throw new Error("Item not found");
        }

        setItem(itemData);
        setItemType(type);

        // Create payment intent via backend
        const response = await apiClient.post("/payments/create-intent", {
          orderId: (itemData as any)._id || (itemData as any).id, // Use MongoDB _id
          amount: price,
        });

        setClientSecret(response.data.data.clientSecret);
      } catch (err: any) {
        console.error("[v0] Checkout init error:", err);
        setError(err.message || "Failed to initialize checkout");
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [siteId, packageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container max-w-2xl py-20">
        <Alert variant="destructive">
          <AlertDescription>{error || "Item not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderOrderSummary = () => {
    if (itemType === "package") {
      const pkg = item as Package;
      const discountPercentage = Math.round(
        ((pkg.price - pkg.discounted_price) / pkg.price) * 100
      );

      return (
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{pkg.category}</Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Save {discountPercentage}%
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {pkg.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Features:</p>
              <ul className="space-y-1">
                {pkg.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-slate-600 flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Original Price</span>
                <span className="line-through text-slate-400">
                  ${pkg.price}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-emerald-600">
                  -${pkg.price - pkg.discounted_price}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${pkg.discounted_price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      const site = item as Site;
      return (
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{site.category}</Badge>
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent/20">
                  DA {site.domain_authority}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg mb-1">{site.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {site.description}
              </p>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Monthly Traffic</span>
                <span className="font-medium">
                  {site.monthly_traffic.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Turnaround Time</span>
                <span className="font-medium">{site.turnaround_days} days</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${site.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ${site.price}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Order</CardTitle>
              <CardDescription>
                Fill in your details to purchase this{" "}
                {itemType === "package" ? "package" : "guest post opportunity"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "#0f172a",
                      },
                    },
                  }}>
                  <CheckoutForm
                    item={item}
                    itemType={itemType}
                    clientSecret={clientSecret}
                  />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>

        <div>{renderOrderSummary()}</div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }>
          <CheckoutContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
