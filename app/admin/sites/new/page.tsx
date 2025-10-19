"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewSitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    domain_authority: "",
    domain_rating: "",
    monthly_traffic: "",
    price: "",
    category: "",
    description: "",
    turnaround_days: "7",
    image_url: "",
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const siteData = {
        name: formData.name,
        url: formData.url,
        domainAuthority: Number.parseInt(formData.domain_authority),
        domainRating: formData.domain_rating
          ? Number.parseInt(formData.domain_rating)
          : 0,
        monthlyTraffic: Number.parseInt(formData.monthly_traffic),
        price: Number.parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        turnaroundDays: Number.parseInt(formData.turnaround_days),
        logoUrl: formData.image_url || null,
        isActive: formData.is_active,
        isFeatured: false,
      };

      const response = await apiClient.post("/sites", siteData);
      console.log("Site created:", response.data);
      toast.success("Site added successfully!");
      router.push("/admin/sites");
    } catch (error: any) {
      console.error("Error adding site:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to add site";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/sites">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Site</h1>
            <p className="text-muted-foreground">
              Create a new guest post opportunity
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Site Details</CardTitle>
              <CardDescription>
                Enter the information for the new guest post site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Site Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="TechCrunch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Website URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="https://techcrunch.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Logo URL</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain_authority">
                    Domain Authority (DA) *
                  </Label>
                  <Input
                    id="domain_authority"
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={formData.domain_authority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        domain_authority: e.target.value,
                      })
                    }
                    placeholder="85"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain_rating">Domain Rating (DR)</Label>
                  <Input
                    id="domain_rating"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.domain_rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        domain_rating: e.target.value,
                      })
                    }
                    placeholder="80"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_traffic">Monthly Traffic *</Label>
                  <Input
                    id="monthly_traffic"
                    type="number"
                    required
                    min="0"
                    value={formData.monthly_traffic}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        monthly_traffic: e.target.value,
                      })
                    }
                    placeholder="500000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="299.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turnaround_days">Turnaround Days *</Label>
                  <Input
                    id="turnaround_days"
                    type="number"
                    required
                    min="1"
                    value={formData.turnaround_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        turnaround_days: e.target.value,
                      })
                    }
                    placeholder="7"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the website and its audience..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">
                  Site is active and visible to customers
                </Label>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Site
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/sites">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
