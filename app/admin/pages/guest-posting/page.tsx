"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/api/client";
import Swal from "sweetalert2";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface PageContent {
  hero: {
    title: string;
    description: string;
  };
  whatsIncluded: {
    title: string;
    description: string;
  };
  whyItMatters: {
    title: string;
    description: string;
  };
  keyBenefits: string[];
  processSteps: ProcessStep[];
  pricingPlans: {
    title: string;
    description: string;
  };
}

export default function AdminGuestPostingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<PageContent>({
    hero: {
      title: "Premium Guest Posting Services",
      description:
        "High-quality, SEO-optimized guest posts that rank and convert. Get published on verified high-authority websites.",
    },
    whatsIncluded: {
      title: "What's Included",
      description:
        "Our expert team crafts compelling, keyword-optimized guest posts that improve your search rankings while engaging your audience. Each article undergoes rigorous research, strategic keyword placement, and SEO best practices to ensure maximum visibility and permanent backlinks on high-authority websites.",
    },
    whyItMatters: {
      title: "Why It Matters",
      description:
        "Quality guest posting is the foundation of successful SEO. Search engines reward websites with valuable, original content from authoritative sources, and it keeps your audience coming back. Fresh, well-researched guest posts establish authority in your niche by establishing yourself as a thought leader and driving organic traffic through high-quality backlinks.",
    },
    keyBenefits: [
      "Improved search rankings & keyword research",
      "Increased organic traffic and visibility",
      "Higher audience engagement and time-on-page",
      "Established industry authority",
      "Long-term SEO benefits",
      "Professional quality guaranteed",
    ],
    processSteps: [
      {
        number: 1,
        title: "Research",
        description: "In-depth keyword & topic research",
      },
      {
        number: 2,
        title: "Outline",
        description: "Strategic content structure",
      },
      {
        number: 3,
        title: "Write",
        description: "Expert content creation",
      },
      {
        number: 4,
        title: "Optimize",
        description: "SEO & quality review",
      },
    ],
    pricingPlans: {
      title: "Pricing Plans",
      description: "Choose the perfect package for your content needs.",
    },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/page-contents/guest-posting");
      if (response.data.success && response.data.data?.sections) {
        setContent(response.data.data.sections);
      }
    } catch (error: any) {
      // If page doesn't exist, use default content
      console.log("Page content not found, using defaults");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.post("/page-contents/upsert", {
        pageId: "guest-posting",
        sections: content,
        isActive: true,
      });

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Page content updated successfully!",
      });
    } catch (error: any) {
      console.error("Error saving content:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to save content",
      });
    } finally {
      setSaving(false);
    }
  };

  const addBenefit = () => {
    setContent({
      ...content,
      keyBenefits: [...content.keyBenefits, ""],
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...content.keyBenefits];
    newBenefits[index] = value;
    setContent({ ...content, keyBenefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = content.keyBenefits.filter((_, i) => i !== index);
    setContent({ ...content, keyBenefits: newBenefits });
  };

  const addProcessStep = () => {
    const newStep: ProcessStep = {
      number: content.processSteps.length + 1,
      title: "",
      description: "",
    };
    setContent({
      ...content,
      processSteps: [...content.processSteps, newStep],
    });
  };

  const updateProcessStep = (
    index: number,
    field: keyof ProcessStep,
    value: string | number
  ) => {
    const newSteps = [...content.processSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    // Re-number steps
    newSteps.forEach((step, i) => {
      step.number = i + 1;
    });
    setContent({ ...content, processSteps: newSteps });
  };

  const removeProcessStep = (index: number) => {
    const newSteps = content.processSteps.filter((_, i) => i !== index);
    // Re-number steps
    newSteps.forEach((step, i) => {
      step.number = i + 1;
    });
    setContent({ ...content, processSteps: newSteps });
  };

  if (loading) {
    return (
      <AdminAuthGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500">Loading...</p>
          </div>
        </AdminLayout>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/admin/pages">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Guest Posting Page
              </h1>
              <p className="text-gray-600 mt-2">
                Manage content for the guest posting services page
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={content.hero.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* What's Included Section */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whats-included-title">Title</Label>
                <Input
                  id="whats-included-title"
                  value={content.whatsIncluded.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whatsIncluded: {
                        ...content.whatsIncluded,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="whats-included-description">Description</Label>
                <Textarea
                  id="whats-included-description"
                  value={content.whatsIncluded.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whatsIncluded: {
                        ...content.whatsIncluded,
                        description: e.target.value,
                      },
                    })
                  }
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Why It Matters Section */}
          <Card>
            <CardHeader>
              <CardTitle>Why It Matters Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="why-matters-title">Title</Label>
                <Input
                  id="why-matters-title"
                  value={content.whyItMatters.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyItMatters: {
                        ...content.whyItMatters,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="why-matters-description">Description</Label>
                <Textarea
                  id="why-matters-description"
                  value={content.whyItMatters.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyItMatters: {
                        ...content.whyItMatters,
                        description: e.target.value,
                      },
                    })
                  }
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Key Benefits Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Key Benefits</CardTitle>
                <Button onClick={addBenefit} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Enter benefit text"
                  />
                  <Button
                    onClick={() => removeBenefit(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Process Steps Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Process Steps</CardTitle>
                <Button onClick={addProcessStep} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.processSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg space-y-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Step {step.number}
                    </span>
                    <Button
                      onClick={() => removeProcessStep(index)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        updateProcessStep(index, "title", e.target.value)
                      }
                      placeholder="Step title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) =>
                        updateProcessStep(index, "description", e.target.value)
                      }
                      placeholder="Step description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing Plans Section */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Plans Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pricing-title">Title</Label>
                <Input
                  id="pricing-title"
                  value={content.pricingPlans.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      pricingPlans: {
                        ...content.pricingPlans,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="pricing-description">Description</Label>
                <Textarea
                  id="pricing-description"
                  value={content.pricingPlans.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      pricingPlans: {
                        ...content.pricingPlans,
                        description: e.target.value,
                      },
                    })
                  }
                  rows={2}
                />
              </div>
              <p className="text-sm text-gray-500">
                Note: Actual pricing plans are managed in the Packages section.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}

