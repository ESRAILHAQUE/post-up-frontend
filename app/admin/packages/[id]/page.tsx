"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import apiClient from "@/lib/api/client";
import { ArrowLeft, Package, Plus, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  features: string[];
  category: string;
  isActive: boolean;
  imageUrl?: string;
}

export default function EditPackagePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discounted_price: "",
    category: "",
    isActive: true,
    imageUrl: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchPackage();
    }
  }, [user, isLoading, router, packageId]);

  const fetchPackage = async () => {
    try {
      setFetching(true);
      const response = await apiClient.get(`/packages/${packageId}`);
      const pkg = response.data.data;

      setFormData({
        name: pkg.name,
        slug: pkg.slug || "",
        description: pkg.description,
        price: pkg.price.toString(),
        discounted_price: pkg.discounted_price.toString(),
        category: pkg.category,
        isActive: pkg.isActive,
        imageUrl: pkg.imageUrl || "",
      });
      setFeatures(pkg.features || []);
    } catch (error: any) {
      console.error("Error fetching package:", error);
      toast.error("Failed to fetch package");
      router.push("/admin/packages");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
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

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.discounted_price ||
      !formData.category
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (features.length === 0) {
      toast.error("Please add at least one feature");
      return;
    }

    try {
      setLoading(true);
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        discounted_price: parseFloat(formData.discounted_price),
        features,
      };

      console.log("[Edit Package] Submitting:", packageData);
      const response = await apiClient.put(
        `/packages/${packageId}`,
        packageData
      );
      console.log("[Edit Package] Response:", response.data);

      toast.success("Package updated successfully!");
      router.push("/admin/packages");
    } catch (error: any) {
      console.error("[Edit Package] Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update package";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete this package? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.delete(`/packages/${packageId}`);
      toast.success("Package deleted successfully");
      router.push("/admin/packages");
    } catch (error: any) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin/packages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Packages
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Package</h1>
          <p className="text-slate-600 mt-2">
            Update package details and settings.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Details
            </CardTitle>
            <CardDescription>
              Update the details for this package.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Premium Guest Post Package"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL-friendly identifier)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="e.g., starter-growth-package"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Used in URLs. Leave empty to auto-generate from name.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guest Post">Guest Post</SelectItem>
                      <SelectItem value="Link Building">
                        Link Building
                      </SelectItem>
                      <SelectItem value="Content Marketing">
                        Content Marketing
                      </SelectItem>
                      <SelectItem value="SEO">SEO</SelectItem>
                      <SelectItem value="Digital Marketing">
                        Digital Marketing
                      </SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe what this package includes..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price">Original Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="299.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discounted_price">
                    Discounted Price ($) *
                  </Label>
                  <Input
                    id="discounted_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.discounted_price}
                    onChange={(e) =>
                      handleInputChange("discounted_price", e.target.value)
                    }
                    placeholder="199.00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label>Features *</Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {features.length > 0 && (
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-50 p-2 rounded">
                          <span className="text-sm">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
                <Label htmlFor="isActive">Active Package</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Updating..." : "Update Package"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/packages")}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
