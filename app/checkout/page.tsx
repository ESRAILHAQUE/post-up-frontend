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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
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

const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "AUuwKpEu_jMYMh_rSvsd00trldIFK04BqOMq0QZkmTO_GMI1lCF1uevwUD5gUW7Mg6Y0wZag3NSj430j";

if (typeof window !== "undefined") {
  console.log(
    "[Checkout] Using PayPal Client ID:",
    PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.slice(0, 15) + "…" : "<missing>"
  );
}

function CheckoutForm({
  item,
  itemType,
}: {
  item: Site | Package;
  itemType: "site" | "package";
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [articleTopic, setArticleTopic] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [anchorText, setAnchorText] = useState("");
  const [keywords, setKeywords] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "balance">(
    "paypal"
  );
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name || "");

      // Fetch user balance
      const fetchBalance = async () => {
        try {
          const response = await apiClient.get(`/users/balance/${user.id}`);
          setUserBalance(response.data.data?.balance || 0);
        } catch (error) {
          console.error("Error fetching balance:", error);
          setUserBalance(0);
        }
      };
      fetchBalance();
    }
  }, [user]);

  const getPrice = () => {
    if (itemType === "package") {
      return (item as Package).discounted_price;
    }
    return (item as Site).price;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Limit to 5 files max
      if (fileArray.length + uploadedFiles.length > 5) {
        setError("Maximum 5 files allowed");
        return;
      }
      // Limit file size to 50MB per file
      const oversizedFiles = fileArray.filter((f) => f.size > 50 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError("Each file must be less than 50MB");
        return;
      }
      setUploadedFiles([...uploadedFiles, ...fileArray]);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const isFormValid = () => {
    if (!name || !email) return false;
    
    if (itemType === "site") {
      if (!targetUrl || !articleTitle || !anchorText) return false;
    } else if (itemType === "package") {
      if (!targetUrl || !articleTitle || !anchorText) return false;
    }
    
    return true;
  };

  const prepareOrderData = async () => {
    const userId = user?.id || "guest";
    const price = getPrice();
    const orderData: any = {
      userId: userId,
      orderType: itemType,
      customerName: name,
      customerEmail: email,
      totalAmount: price,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === "balance" ? "paid" : "pending",
      status: "pending",
    };

    // Add type-specific fields
    if (itemType === "package") {
      orderData.packageId = (item as any)._id || item.id;
      if (specialInstructions)
        orderData.specialInstructions = specialInstructions;
    } else {
      orderData.siteId = (item as any)._id || item.id;
      orderData.targetUrl = targetUrl;
      orderData.articleTitle = articleTitle;
      orderData.anchorText = anchorText;
      if (articleTopic) orderData.articleTopic = articleTopic;
      if (keywords) orderData.keywords = keywords;
      if (specialInstructions)
        orderData.specialInstructions = specialInstructions;

      // Convert files to base64
      if (uploadedFiles.length > 0) {
        const filePromises = uploadedFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                data: reader.result,
              });
            };
            reader.readAsDataURL(file);
          });
        });
        const filesData = await Promise.all(filePromises);
        orderData.uploadedDocuments = filesData;
      }
    }
    return orderData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const price = getPrice();

      // Handle balance payment
      if (paymentMethod === "balance") {
        if (userBalance < price) {
          throw new Error(
            `Insufficient balance. You have $${userBalance.toFixed(
              2
            )}, but need $${price.toFixed(2)}`
          );
        }

        const orderData = await prepareOrderData();
        console.log(
          "[Checkout] Creating order with balance payment:",
          orderData
        );
        const orderResponse = await apiClient.post("/orders", orderData);
        const order = orderResponse.data.data;

        // Deduct from balance
        await apiClient.post(`/users/deduct-balance`, {
          userId: user?.id,
          amount: price,
        });

        router.push(`/checkout/success?order=${order._id}`);
        return;
      }

      // PayPal payment is handled by PayPal button (see UI below)
      if (paymentMethod === "paypal") {
        setError("Please use the PayPal button below to complete payment");
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("[v0] Checkout error:", err);
      console.error("[v0] Error response:", err.response?.data);
      console.error("[v0] Error status:", err.response?.status);
      console.error(
        "[v0] Full error:",
        JSON.stringify(err.response?.data, null, 2)
      );

      let errorMessage = "Payment failed. Please try again.";

      if (err.response?.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="articleTitle">Article Title *</Label>
                <Input
                  id="articleTitle"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g., 10 Best SEO Practices for 2025"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="articleTopic">Article Topic/Category</Label>
                <Input
                  id="articleTopic"
                  value={articleTopic}
                  onChange={(e) => setArticleTopic(e.target.value)}
                  placeholder="e.g., SEO, Marketing, Technology"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="anchorText">Anchor Text *</Label>
                <Input
                  id="anchorText"
                  value={anchorText}
                  onChange={(e) => setAnchorText(e.target.value)}
                  placeholder="e.g., best SEO tools"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  The clickable text for your backlink
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Target Keywords (Optional)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="SEO, link building, backlinks"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">
                Upload Files & Images (Optional)
              </Label>
              <Input
                id="fileUpload"
                type="file"
                multiple
                accept=".doc,.docx,.pdf,.txt,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
                onChange={handleFileUpload}
                disabled={loading}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload documents, images, or reference materials (Max 5 files,
                50MB each)
              </p>

              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  {uploadedFiles.map((file, index) => {
                    const isImage = file.type.startsWith("image/");
                    const fileExtension = file.name
                      .split(".")
                      .pop()
                      ?.toLowerCase();
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isImage ? (
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-xs text-blue-600">📷</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                {fileExtension === "pdf"
                                  ? "📄"
                                  : fileExtension === "doc" ||
                                    fileExtension === "docx"
                                  ? "📝"
                                  : fileExtension === "zip" ||
                                    fileExtension === "rar"
                                  ? "📦"
                                  : "📎"}
                              </span>
                            </div>
                          )}
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={loading}>
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any specific requirements, tone of voice, or preferences..."
                rows={4}
                disabled={loading}
              />
            </div>
          </>
        )}

        {itemType === "package" && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="articleTitle">Article Title *</Label>
                <Input
                  id="articleTitle"
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  placeholder="e.g., 10 Best SEO Practices for 2025"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="articleTopic">Article Topic/Category</Label>
                <Input
                  id="articleTopic"
                  value={articleTopic}
                  onChange={(e) => setArticleTopic(e.target.value)}
                  placeholder="e.g., SEO, Marketing, Technology"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="anchorText">Anchor Text *</Label>
                <Input
                  id="anchorText"
                  value={anchorText}
                  onChange={(e) => setAnchorText(e.target.value)}
                  placeholder="e.g., best SEO tools"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  The clickable text for your backlink
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Target Keywords (Optional)</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="SEO, link building, backlinks"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">
                Upload Files & Images (Optional)
              </Label>
              <Input
                id="fileUpload"
                type="file"
                multiple
                accept=".doc,.docx,.pdf,.txt,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
                onChange={handleFileUpload}
                disabled={loading}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Upload documents, images, or reference materials (Max 5 files,
                10MB each)
              </p>

              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  {uploadedFiles.map((file, index) => {
                    const isImage = file.type.startsWith("image/");
                    const fileExtension = file.name
                      .split(".")
                      .pop()
                      ?.toLowerCase();
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {isImage ? (
                            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-xs text-blue-600">📷</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-600">
                                {fileExtension === "pdf"
                                  ? "📄"
                                  : fileExtension === "doc" ||
                                    fileExtension === "docx"
                                  ? "📝"
                                  : fileExtension === "zip" ||
                                    fileExtension === "rar"
                                  ? "📦"
                                  : "📎"}
                              </span>
                            </div>
                          )}
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={loading}>
                          Remove
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">
                Special Instructions (Optional)
              </Label>
              <Textarea
                id="specialInstructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any specific requirements, tone of voice, or preferences..."
                rows={4}
                disabled={loading}
              />
            </div>
          </>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Payment Method</h3>

        {/* Payment Method Selection */}
        {!isFormValid() && (
          <Alert>
            <AlertDescription>
              Please fill in all required fields above to select a payment method.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod("paypal")}
            disabled={!isFormValid()}
            className={`p-4 border-2 rounded-lg transition-all ${
              !isFormValid()
                ? "opacity-50 cursor-not-allowed border-border"
                : paymentMethod === "paypal"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}>
            <div className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.806.806 0 01-.795.68H7.822a.563.563 0 01-.555-.65l1.316-8.347.014-.099a.806.806 0 01.794-.68h1.632c3.238 0 5.774-1.314 6.514-5.12.257-1.313.192-2.447-.3-3.327-.09-.16-.192-.312-.3-.457C18.213 5.894 20.25 7.23 20.067 8.478z" fill="#139AD6"/>
                <path d="M17.937 7.968c-.09-.16-.192-.312-.3-.457-.975-1.096-2.747-1.556-5.006-1.556h-4.29a.806.806 0 00-.795.68l-1.14 7.229-.033.209a.805.805 0 00.794.68h1.632c3.238 0 5.774-1.314 6.514-5.12.257-1.313.192-2.447-.3-3.327-.09-.16-.192-.312-.3-.457z" fill="#263B80"/>
              </svg>
              <span className="font-semibold">PayPal</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("balance")}
            disabled={!isFormValid()}
            className={`p-4 border-2 rounded-lg transition-all ${
              !isFormValid()
                ? "opacity-50 cursor-not-allowed border-border"
                : paymentMethod === "balance"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}>
            <div className="text-center">
              <div className="font-semibold">Balance</div>
              <div className="text-sm text-muted-foreground mt-1">
                ${userBalance.toFixed(2)}
              </div>
            </div>
          </button>
        </div>

        {paymentMethod === "paypal" && isFormValid() && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Complete Payment</h3>
            {!PAYPAL_CLIENT_ID ? (
              <Alert variant="destructive">
                <AlertDescription>
                  PayPal is not configured. Please contact support.
                </AlertDescription>
              </Alert>
            ) : (
              <PayPalButtons
              style={{ layout: "vertical", label: "pay" }}
              disabled={loading || !isFormValid()}
                createOrder={async () => {
                  try {
                    const orderData = await prepareOrderData();
                    console.log("[PayPal] Creating order:", orderData);

                    // Create order in backend first
                    const orderResponse = await apiClient.post(
                      "/orders",
                      orderData
                    );
                    const order = orderResponse.data.data;

                    // Create PayPal order
                    const paypalResponse = await apiClient.post(
                      "/payments/paypal/create-order",
                      {
                        orderId: order._id,
                        amount: getPrice(),
                      }
                    );

                    return paypalResponse.data.data.orderId;
                  } catch (error: any) {
                    console.error("[PayPal] Create order error:", error);
                    setError(
                      error.response?.data?.error ||
                        "Failed to create PayPal order"
                    );
                    throw error;
                  }
                }}
                onApprove={async (data: any) => {
                  try {
                    setLoading(true);
                    // Capture payment
                    await apiClient.post("/payments/paypal/capture", {
                      paypalOrderId: data.orderID,
                    });

                    // Redirect to success (order ID is in the PayPal order reference)
                    router.push(`/checkout/success?paypal=${data.orderID}`);
                  } catch (error: any) {
                    console.error("[PayPal] Capture error:", error);
                    setError(
                      error.response?.data?.error || "Payment capture failed"
                    );
                    setLoading(false);
                  }
                }}
                onError={(error: any) => {
                  console.error("[PayPal] Error:", error);
                  setError("PayPal payment failed. Please try again.");
                }}
                onCancel={() => {
                  setError("Payment cancelled. You can try again when ready.");
                }}
              />
            )}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {paymentMethod === "balance" && (
        <Button type="submit" size="lg" className="w-full" disabled={loading || !isFormValid()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${getPrice()} with Balance`
          )}
        </Button>
      )}

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
          // Support both real backend ObjectIds and mock IDs from demo data
          const isObjectId = /^[a-fA-F0-9]{24}$/.test(siteId);
          if (isObjectId) {
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
              price = (itemData as Site).price;
            } catch (siteError) {
              console.error("[v0] Site fetch error:", siteError);
              throw new Error(
                "Site not found. Please select a site from the marketplace."
              );
            }
          } else {
            // Fall back to mock dataset
            const mock = getSiteById(siteId);
            if (!mock) {
              throw new Error(
                "Invalid site link. Please select a site from the marketplace."
              );
            }
            itemData = mock as unknown as Site;
            type = "site";
            price = mock.price;
          }
        }

        if (!itemData) {
          throw new Error("Item not found");
        }

        setItem(itemData);
        setItemType(type);
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

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="container max-w-2xl py-20">
        <Alert variant="destructive">
          <AlertDescription>
            PayPal is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID
            and reload.
          </AlertDescription>
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
              <PayPalScriptProvider
                options={{
                  clientId: PAYPAL_CLIENT_ID,
                  currency: "USD",
                  intent: "capture",
                }}>
                <CheckoutForm item={item} itemType={itemType} />
              </PayPalScriptProvider>
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
