"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditSitePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    domain_authority: "",
    domain_rating: "",
    monthly_traffic: "",
    price: "",
    category: "",
    publishedExampleUrl: "",
    turnaround_days: "7",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (params.id === "new") {
      router.replace("/admin/sites/new");
      return;
    }
    loadSite();
  }, [params.id]);

  const loadSite = async () => {
    if (params.id === "new") {
      return;
    }

    try {
      const response = await apiClient.get(`/sites/${params.id}`);
      const site = response.data.data;

      if (!site) {
        toast.error("Site not found");
        router.push("/admin/sites");
        return;
      }

      setFormData({
        name: site.name,
        url: site.url,
        domain_authority: (
          site.domainAuthority ||
          site.domain_authority ||
          0
        ).toString(),
        domain_rating: (
          site.domainRating ||
          site.domain_rating ||
          0
        ).toString(),
        monthly_traffic: (
          site.monthlyTraffic ||
          site.monthly_traffic ||
          0
        ).toString(),
        price: site.price.toString(),
        category: site.category,
        publishedExampleUrl: site.publishedExampleUrl || site.description || "",
        turnaround_days: (
          site.turnaroundDays ||
          site.turnaround_days ||
          7
        ).toString(),
        image_url: site.logoUrl || site.image_url || "",
        is_active: site.isActive !== undefined ? site.isActive : site.is_active,
      });
    } catch (error: any) {
      console.error("Error loading site:", error);
      toast.error("Failed to load site");
      router.push("/admin/sites");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

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
        publishedExampleUrl: formData.publishedExampleUrl,
        turnaroundDays: Number.parseInt(formData.turnaround_days),
        logoUrl: formData.image_url || null,
        isActive: formData.is_active,
      };

      await apiClient.put(`/sites/${params.id}`, siteData);
      toast.success("Site updated successfully!");
      router.push("/admin/sites");
    } catch (error: any) {
      console.error("Error updating site:", error);
      toast.error(
        error.response?.data?.error || error.message || "Failed to update site"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this site? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      await apiClient.delete(`/sites/${params.id}`);
      toast.success("Site deleted successfully!");
      router.push("/admin/sites");
    } catch (error: any) {
      console.error("Error deleting site:", error);
      toast.error(
        error.response?.data?.error || error.message || "Failed to delete site"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (params.id === "new" || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/sites">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Site</h1>
              <p className="text-muted-foreground">Update site information</p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}>
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Site
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Site Details</CardTitle>
              <CardDescription>
                Update the information for this guest post site
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
                      <SelectItem value="Automotive">Automotive</SelectItem>
                      <SelectItem value="Cryptocurrency">
                        Cryptocurrency
                      </SelectItem>
                      <SelectItem value="Fashion & Beauty">
                        Fashion & Beauty
                      </SelectItem>
                      <SelectItem value="Financial">Financial</SelectItem>
                      <SelectItem value="Food & Cuisine">
                        Food & Cuisine
                      </SelectItem>
                      <SelectItem value="Gambling & Betting">
                        Gambling & Betting
                      </SelectItem>
                      <SelectItem value="General News">General News</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Health & Medicine">
                        Health & Medicine
                      </SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Trading">Trading</SelectItem>
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
                    type="text"
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
                    type="text"
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
                    type="text"
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
                    type="text"
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
                    type="text"
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
                <Label htmlFor="publishedExampleUrl">Published Example</Label>
                <Input
                  id="publishedExampleUrl"
                  type="url"
                  value={formData.publishedExampleUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publishedExampleUrl: e.target.value,
                    })
                  }
                  placeholder="https://finance.yahoo.com/news/prnews-io-..."
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
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
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
