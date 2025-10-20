"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import {
  Search,
  X,
  Globe,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

interface Site {
  id: string;
  name: string;
  url: string;
  domain_authority: number;
  domain_rating: number;
  monthly_traffic: number;
  price: number;
  category: string;
  description: string;
  turnaround_days: number;
  is_active: boolean;
  image_url: string | null;
}

export default function MarketplacePage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [filteredSites, setFilteredSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [daRange, setDaRange] = useState([0, 100]);
  const [drRange, setDrRange] = useState([0, 100]);
  const [trafficRange, setTrafficRange] = useState([0, 500000000000]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchSites();
    const interval = setInterval(() => {
      fetchSites(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterSites();
  }, [
    sites,
    searchQuery,
    selectedCategories,
    daRange,
    drRange,
    trafficRange,
    priceRange,
  ]);

  async function fetchSites(silent = false) {
    if (!silent) {
      setLoading(true);
    }
    try {
      const response = await apiClient.get("/sites");
      const activeSites = (response.data.data || [])
        .filter((site: any) => site.isActive)
        .map((site: any) => ({
          id: site._id,
          name: site.name,
          url: site.url,
          domain_authority: site.domainAuthority,
          domain_rating: site.domainRating,
          monthly_traffic: site.monthlyTraffic,
          price: site.price,
          category: site.category,
          description: site.description,
          turnaround_days: site.turnaroundDays,
          is_active: site.isActive,
          image_url: site.imageUrl || site.logoUrl || null,
        }));
      setSites(activeSites);
      setFilteredSites(activeSites);
    } catch (error: any) {
      console.error("[v0] Error fetching sites:", error);

      // Handle rate limiting error
      if (error.response?.status === 429) {
        console.warn("[v0] Rate limited, retrying in 5 seconds...");
        setTimeout(() => {
          fetchSites(silent);
        }, 5000);
        return;
      }

      setSites([]);
      setFilteredSites([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchSites();
    setTimeout(() => setRefreshing(false), 500);
  }

  function filterSites() {
    let filtered = sites;

    if (searchQuery) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((site) =>
        selectedCategories.includes(site.category)
      );
    }

    filtered = filtered.filter(
      (site) =>
        site.domain_authority >= daRange[0] &&
        site.domain_authority <= daRange[1]
    );

    filtered = filtered.filter(
      (site) =>
        site.domain_rating >= drRange[0] && site.domain_rating <= drRange[1]
    );

    filtered = filtered.filter(
      (site) =>
        site.monthly_traffic >= trafficRange[0] &&
        site.monthly_traffic <= trafficRange[1]
    );

    filtered = filtered.filter(
      (site) => site.price >= priceRange[0] && site.price <= priceRange[1]
    );
    setFilteredSites(filtered);
  }

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategories([]);
    setDaRange([0, 100]);
    setDrRange([0, 100]);
    setTrafficRange([0, 500000000000]);
    setPriceRange([0, 5000]);
  }

  function toggleDescription(siteId: string) {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(siteId)) {
        newSet.delete(siteId);
      } else {
        newSet.add(siteId);
      }
      return newSet;
    });
  }

  const categories = Array.from(new Set(sites.map((site) => site.category)));
  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    daRange[0] > 0 ||
    daRange[1] < 100 ||
    drRange[0] > 0 ||
    drRange[1] < 100 ||
    trafficRange[0] > 0 ||
    trafficRange[1] < 500000000000 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SiteHeader />

      <section className="py-12 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-slate-900">
              Guest Post Marketplace
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Browse our complete collection of high-authority websites. Find
              the perfect match for your content and niche.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 shrink-0">
              <div className="sticky top-4 space-y-6">
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-900">Filters</CardTitle>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-emerald-600 h-auto p-0 hover:text-emerald-700">
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-slate-700">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search sites..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700">Category</Label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                              className="border-slate-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <label
                              htmlFor={category}
                              className="text-sm text-slate-700 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700">
                        Domain Authority: {daRange[0]} - {daRange[1]}
                      </Label>
                      <Slider
                        value={daRange}
                        onValueChange={setDaRange}
                        min={0}
                        max={100}
                        step={5}
                        className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700">
                        Domain Rating: {drRange[0]} - {drRange[1]}
                      </Label>
                      <Slider
                        value={drRange}
                        onValueChange={setDrRange}
                        min={0}
                        max={100}
                        step={5}
                        className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700">
                        Monthly Traffic: {trafficRange[0].toLocaleString()} -{" "}
                        {trafficRange[1].toLocaleString()}
                      </Label>
                      <Slider
                        value={trafficRange}
                        onValueChange={setTrafficRange}
                        min={0}
                        max={500000000000}
                        step={1000000}
                        className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700">
                        Price: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={5000}
                        step={100}
                        className="[&_[role=slider]]:bg-emerald-600 [&_[role=slider]]:border-emerald-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {filteredSites.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {sites.length}
                  </span>{" "}
                  sites
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="gap-2 bg-transparent">
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Loading sites...</p>
                </div>
              ) : filteredSites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">
                    No sites found matching your filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4 bg-transparent">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSites.map((site) => (
                    <Card
                      key={site.id}
                      className="flex flex-col hover:shadow-lg transition-all bg-white border-slate-200 hover:border-emerald-500">
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="shrink-0">
                            {site.image_url ? (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white">
                                <Image
                                  src={site.image_url || "/placeholder.svg"}
                                  alt={`${site.name} logo`}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <Globe className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1 truncate">
                              {site.name}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                              {site.url}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {site.category}
                          </Badge>
                          <div className="flex gap-1">
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                              DA {site.domain_authority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                              DR {site.domain_rating}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 pb-3">
                        <div className="space-y-3">
                          {/* Traffic */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Traffic</span>
                            <span className="font-semibold text-slate-900">
                              {site.monthly_traffic.toLocaleString()}/mo
                            </span>
                          </div>

                          {/* Delivery */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Delivery</span>
                            <span className="font-semibold text-slate-900">
                              {site.turnaround_days} days
                            </span>
                          </div>

                          {/* Description with Read More */}
                          {site.description && (
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-700">
                                Description:
                              </p>
                              <div className="text-xs text-slate-600">
                                {expandedDescriptions.has(site.id) ? (
                                  <div className="space-y-2">
                                    <p className="whitespace-pre-wrap">
                                      {site.description}
                                    </p>
                                    <button
                                      onClick={() => toggleDescription(site.id)}
                                      className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                                      <ChevronUp className="h-3 w-3" />
                                      Show Less
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <p className="line-clamp-2">
                                      {site.description}
                                    </p>
                                    {site.description.length > 100 && (
                                      <button
                                        onClick={() =>
                                          toggleDescription(site.id)
                                        }
                                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                                        <ChevronDown className="h-3 w-3" />
                                        Read More
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Price */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="text-slate-600">Price</span>
                            <span className="text-xl font-bold text-emerald-600">
                              ${site.price}
                            </span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-3">
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          asChild>
                          <Link href={`/checkout?site=${site.id}`}>
                            Buy Now
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
