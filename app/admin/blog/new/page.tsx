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
import { ArrowLeft, Upload, X, Bold, Italic, Link as LinkIcon, List, ListOrdered, Heading2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: "Please select an image smaller than 5MB",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Please select an image file",
      });
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
  };

  const insertFormatting = (before: string, after: string = "") => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText =
      formData.content.substring(0, start) +
      before +
      selectedText +
      after +
      formData.content.substring(end);

    setFormData({ ...formData, content: newText });
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    const text = prompt("Enter link text:") || url;
    insertFormatting(`<a href="${url}">`, `</a>`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let featuredImageUrl = formData.featuredImage;

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        
        await new Promise((resolve) => {
          reader.onloadend = async () => {
            try {
              const uploadResponse = await apiClient.post("/blog/upload-image", {
                image: reader.result,
                fileName: imageFile.name,
              });
              featuredImageUrl = uploadResponse.data.data.url;
              resolve(null);
            } catch (err) {
              console.error("Image upload error:", err);
              resolve(null);
            }
          };
        });
        setUploadingImage(false);
      }

      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const postData = {
        ...formData,
        featuredImage: featuredImageUrl,
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
                  <Label htmlFor="featuredImage">Featured Image *</Label>
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {(imagePreview || formData.featuredImage) && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || formData.featuredImage}
                          alt="Featured"
                          className="w-full max-w-md h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    {!imagePreview && !formData.featuredImage && (
                      <div>
                        <label
                          htmlFor="imageUpload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </label>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Or paste image URL below (Max 5MB)
                        </p>
                      </div>
                    )}

                    {/* Manual URL Input */}
                    <Input
                      id="featuredImage"
                      value={formData.featuredImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featuredImage: e.target.value,
                        })
                      }
                      placeholder="Or paste image URL: https://example.com/image.jpg"
                    />
                  </div>
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
                  <Label htmlFor="content">Blog Content *</Label>
                  
                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap gap-2 mt-2 p-2 bg-gray-50 border rounded-t-lg">
                    <button
                      type="button"
                      onClick={() => insertFormatting("<h2>", "</h2>")}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Heading">
                      <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<strong>", "</strong>")}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Bold">
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<em>", "</em>")}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Italic">
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Insert Link">
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Bullet List">
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<ol>\n  <li>", "</li>\n</ol>")}
                      className="p-2 hover:bg-gray-200 rounded"
                      title="Numbered List">
                      <ListOrdered className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting("<p>", "</p>")}
                      className="px-3 py-2 hover:bg-gray-200 rounded text-sm"
                      title="Paragraph">
                      P
                    </button>
                  </div>

                  {/* Content Textarea */}
                  <Textarea
                    ref={contentRef}
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    rows={15}
                    placeholder="Write your blog content here... Select text and use buttons above to format."
                    className="rounded-t-none font-mono text-sm"
                  />

                  {/* Preview Toggle */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      id="togglePreview"
                      type="checkbox"
                      className="h-4 w-4"
                      checked={showPreview}
                      onChange={(e) => setShowPreview(e.target.checked)}
                    />
                    <Label htmlFor="togglePreview">Show Preview</Label>
                  </div>

                  {/* Live Preview */}
                  {showPreview && (
                    <div className="mt-4 rounded-lg border p-6 bg-white">
                      <h3 className="font-semibold mb-4">Preview:</h3>
                      <div className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formData.content || "<p class='text-gray-400'>Nothing to preview yet...</p>",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-2">
                    💡 Tip: Select text and click formatting buttons. You can paste image URLs directly in the content.
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
                  disabled={isSubmitting || uploadingImage}
                  className="bg-emerald-600 hover:bg-emerald-700">
                  {uploadingImage
                    ? "Uploading Image..."
                    : isSubmitting
                    ? "Creating..."
                    : "Create Blog Post"}
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
