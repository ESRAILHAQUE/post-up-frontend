"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import apiClient from "@/lib/api/client";
import { ArrowLeft, Plus, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface LinkBuildingPlan {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  linksPerMonth: string;
  features: string[];
  popular: boolean;
  isActive: boolean;
  order: number;
}

export default function EditLinkBuildingPlanPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    linksPerMonth: "",
    popular: false,
    isActive: true,
    order: 0,
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchPlan();
    }
  }, [user, isLoading, router, planId]);

  const fetchPlan = async () => {
    try {
      setFetching(true);
      const response = await apiClient.get(`/link-building/${planId}`);
      const plan: LinkBuildingPlan = response.data.data;

      console.log("[Fetch Plan] Received plan price:", plan.price);
      console.log("[Fetch Plan] Price type:", typeof plan.price);
      console.log("[Fetch Plan] Price as string:", String(plan.price));

      setFormData({
        name: plan.name,
        slug: plan.slug || "",
        price: String(plan.price),
        linksPerMonth: plan.linksPerMonth,
        popular: plan.popular,
        isActive: plan.isActive,
        order: plan.order || 0,
      });
      setFeatures(plan.features || []);
    } catch (error: any) {
      console.error("Error fetching plan:", error);
      toast.error("Failed to fetch plan");
      router.push("/admin/link-building");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.linksPerMonth) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (features.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    try {
      setLoading(true);
      const priceValue = Number(formData.price);
      console.log("[Edit Plan] Form price value:", formData.price);
      console.log("[Edit Plan] Converted price:", priceValue);
      
      const planData = {
        ...formData,
        price: priceValue,
        order: parseInt(formData.order.toString()),
        features,
        slug: formData.slug || undefined,
      };

      console.log("[Edit Plan] Sending planData:", planData);
      await apiClient.put(`/link-building/${planId}`, planData);
      toast.success("Link building plan updated successfully!");
      router.push("/admin/link-building");
    } catch (error: any) {
      console.error("Error updating plan:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update plan";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/link-building">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Link Building Plan</h1>
            <p className="text-muted-foreground">
              Update the pricing plan details.
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Plan Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Starter, Pro, Growth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (optional, auto-generated if empty)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="e.g., starter-plan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="any"
                      value={formData.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        console.log("[Input] Price changed:", value);
                        handleInputChange("price", value);
                      }}
                      placeholder="299"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linksPerMonth">
                      Links Per Month <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="linksPerMonth"
                      value={formData.linksPerMonth}
                      onChange={(e) => handleInputChange("linksPerMonth", e.target.value)}
                      placeholder="8+"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                  <p className="text-sm text-muted-foreground">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                        <span className="flex-1 text-sm">{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                        placeholder="Add a feature..."
                      />
                      <Button type="button" onClick={addFeature}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="popular">Popular Plan</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark this plan as popular (will show POPULAR badge)
                    </p>
                  </div>
                  <Switch
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) =>
                      handleInputChange("popular", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Only active plans are displayed on the homepage
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange("isActive", checked)
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Plan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

