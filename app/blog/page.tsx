"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/blog?isPublished=true");
      console.log("[Blog Page] API Response:", response.data);

      if (response.data.data && response.data.data.length > 0) {
        const posts = response.data.data;
        setBlogPosts(posts);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(posts.map((post: BlogPost) => post.category))
        );
        setCategories(uniqueCategories);
        console.log("[Blog Page] Loaded", posts.length, "blog posts");
      } else {
        console.log("[Blog Page] No published blog posts found");
        setBlogPosts([]);
      }
    } catch (error) {
      console.error("[Blog Page] Error fetching blog posts:", error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  // Helper function to extract text from HTML content
  const getExcerpt = (htmlContent: string, maxLength = 150) => {
    const text = htmlContent.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              SEO & Guest Posting Blog
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Expert insights, strategies, and tips to help you master guest
              posting and build high-quality backlinks.
            </p>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <p className="ml-3 text-muted-foreground">
                Loading blog posts...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 border-b bg-background">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}>
              All Posts
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-accent"
                onClick={() => setSelectedCategory(category)}>
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="py-12 bg-background">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={
                        featuredPost.featuredImage ||
                        "/placeholder.svg?height=400&width=600"
                      }
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <Badge variant="secondary" className="w-fit mb-3">
                      Featured
                    </Badge>
                    <CardTitle className="text-2xl md:text-3xl mb-3">
                      {featuredPost.title}
                    </CardTitle>
                    <CardDescription className="text-base mb-4 leading-relaxed">
                      {featuredPost.excerpt ||
                        getExcerpt(featuredPost.content, 200)}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(
                            featuredPost.publishedAt || featuredPost.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.ceil(
                            featuredPost.content.split(" ").length / 200
                          )}{" "}
                          min read
                        </span>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="bg-emerald-600 hover:bg-emerald-700">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        Read Article <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      {!loading && remainingPosts.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map((post) => (
                <Card
                  key={post._id}
                  className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={
                        post.featuredImage ||
                        "/placeholder.svg?height=300&width=400"
                      }
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt || getExcerpt(post.content)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(
                            post.publishedAt || post.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {Math.ceil(post.content.split(" ").length / 200)} min
                          read
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && filteredPosts.length === 0 && (
        <section className="py-16 bg-background">
          <div className="container">
            <div className="max-w-md mx-auto text-center">
              <p className="text-muted-foreground">
                {blogPosts.length === 0
                  ? "No blog posts found. Check back soon!"
                  : "No blog posts found in this category."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold">Stay Updated</h2>
            <p className="text-lg text-emerald-50">
              Get the latest SEO tips and guest posting strategies delivered to
              your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
