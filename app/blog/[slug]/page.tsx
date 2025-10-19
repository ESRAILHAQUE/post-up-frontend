"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { useEffect, useState, use } from "react";
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
  type BlogPost,
} from "@/lib/data/mock-data";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const blogPost = getBlogPostBySlug(slug);

    if (!blogPost) {
      router.push("/blog");
      return;
    }

    if (blogPost.status !== "published") {
      router.push("/blog");
      return;
    }

    setPost(blogPost);
    setRelatedPosts(getRelatedBlogPosts(blogPost.id, 3));
    setIsLoading(false);
  }, [slug, router]);

  const getExcerpt = (htmlContent: string, maxLength = 150) => {
    const text = htmlContent.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{post.seo_title}</title>
        <meta name="description" content={post.meta_description} />
        <meta name="keywords" content={post.focus_keyword} />
        <meta property="og:title" content={post.seo_title} />
        <meta property="og:description" content={post.meta_description} />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image} />
        )}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo_title} />
        <meta name="twitter:description" content={post.meta_description} />
        {post.featured_image && (
          <meta name="twitter:image" content={post.featured_image} />
        )}
      </Head>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />

        {/* Back Button */}
        <section className="py-6 bg-background border-b">
          <div className="container">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Article Header */}
        <article className="py-12 bg-background">
          <div className="container max-w-4xl">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  {post.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-700 font-semibold">
                        {post.author_name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {post.author_name || "Admin"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.publish_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.read_time} min read</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
                  <img
                    src={post.featured_image || "/placeholder.svg"}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container max-w-6xl">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card
                    key={relatedPost.id}
                    className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={
                          relatedPost.featured_image ||
                          "/placeholder.svg?height=300&width=400"
                        }
                        alt={relatedPost.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-lg line-clamp-2">
                        {relatedPost.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {getExcerpt(relatedPost.content)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{relatedPost.read_time} min</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0">
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-emerald-600 text-white">
          <div className="container max-w-4xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Ready to Boost Your SEO?</h2>
              <p className="text-lg text-emerald-50">
                Get high-quality guest posts on premium websites and build
                powerful backlinks that drive results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                  asChild>
                  <Link href="/marketplace">Browse Opportunities</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-emerald-700 bg-transparent"
                  asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
