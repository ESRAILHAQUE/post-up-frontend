"use client";

import type React from "react";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import Swal from "sweetalert2";

export default function NewBlogPostPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    featuredImage: "",
    category: "",
    author: "",
    authorId: "",
    content: "",
    excerpt: "",
    tags: "",
    isPublished: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        author: user.name,
        authorId: user.id,
      }));
    }
  }, [user, isLoading, router]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const postData = {
        ...formData,
        tags: tagsArray,
      };

      console.log("[New Blog Post] Submitting:", postData);
      const response = await apiClient.post("/blog", postData);
      console.log("[New Blog Post] Response:", response.data);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Blog post created successfully!",
      });
      router.push("/admin/blog");
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to create blog post";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error: ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Blog Post
            </h1>
            <p className="text-gray-600 mt-1">Add a new post to your blog</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Blog Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    placeholder="Enter blog title"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="slug">Slug/URL *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                    placeholder="blog-post-url"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL: /blog/{formData.slug}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featuredImage: e.target.value,
                      })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    placeholder="SEO, Content Marketing, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                    placeholder="Brief description of the blog post..."
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="content">Content (HTML) *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    rows={12}
                    placeholder="<h2>Heading</h2><p>Your content here...</p>"
                    className="font-mono text-sm"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use HTML tags for formatting
                  </p>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="SEO, Marketing, Tips"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="isPublished">Publish Status</Label>
                  <Select
                    value={formData.isPublished ? "published" : "draft"}
                    onValueChange={(value: "draft" | "published") =>
                      setFormData({
                        ...formData,
                        isPublished: value === "published",
                      })
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700">
                  {isSubmitting ? "Creating..." : "Create Blog Post"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/blog">Cancel</Link>
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
