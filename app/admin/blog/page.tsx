"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminBlogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
      return;
    }

    if (user && user.role === "admin") {
      fetchPosts();
    }
  }, [user, isLoading, router]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // Fetch from backend API
      const response = await apiClient.get("/blog");
      console.log("[Admin Blog] API Response:", response.data);

      if (response.data.data && response.data.data.length > 0) {
        console.log(
          "[Admin Blog] Found",
          response.data.data.length,
          "blog posts"
        );
        setPosts(response.data.data);
      } else {
        console.log("[Admin Blog] No blog posts found");
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch blog posts. Please check backend connection.",
      });
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/blog/${id}`);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Blog post deleted successfully!",
        });
        fetchPosts();
      } catch (error) {
        console.error("Error deleting blog post:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete blog post",
        });
      }
    }
  };

  if (isLoading || loading) {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-600 mt-1">Manage your blog content</p>
          </div>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Post
            </Link>
          </Button>
        </div>

        <div className="grid gap-6">
          {posts.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 mb-4">No blog posts yet</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/admin/blog/new">Create Your First Post</Link>
              </Button>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post._id} className="p-6">
                <div className="flex gap-6">
                  {post.featuredImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <span>{post.author}</span>
                          <span>•</span>
                          <span>
                            {new Date(
                              post.publishedAt || post.createdAt
                            ).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{post.views} views</span>
                          <span>•</span>
                          <Badge
                            variant={
                              post.isPublished ? "default" : "secondary"
                            }>
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Category: {post.category} | Tags:{" "}
                          {post.tags.join(", ")}
                        </p>
                        {post.excerpt && (
                          <p className="text-gray-500 text-sm mb-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.isPublished && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/blog/${post._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
