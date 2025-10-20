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
  Package,
  RefreshCw,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

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

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    fetchPackages();
    const interval = setInterval(() => {
      fetchPackages(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchQuery, selectedCategories, priceRange]);

  async function fetchPackages(silent = false) {
    if (!silent) {
      setLoading(true);
    }
    try {
      console.log("[Packages] Fetching packages from backend...");
      const response = await apiClient.get("/packages");
      console.log("[Packages] API Response:", response.data);
      console.log("[Packages] Packages data:", response.data.data);

      // Handle both response.data.data (array) and response.data.data.packages (object with packages array)
      const packagesData = Array.isArray(response.data.data)
        ? response.data.data
        : response.data.data?.packages || [];

      const activePackages = packagesData
        .filter((pkg: any) => pkg.isActive)
        .map((pkg: any) => ({
          _id: pkg._id,
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          discounted_price: pkg.discounted_price,
          features: pkg.features,
          category: pkg.category,
          isActive: pkg.isActive,
          imageUrl: pkg.imageUrl,
        }));

      console.log("[Packages] Fetched packages:", activePackages.length);
      setPackages(activePackages);
      setFilteredPackages(activePackages);
    } catch (error: any) {
      console.error("[Packages] Error fetching packages:", error);

      // Handle rate limiting error
      if (error.response?.status === 429) {
        console.warn("[Packages] Rate limited, retrying in 5 seconds...");
        setTimeout(() => {
          fetchPackages(silent);
        }, 5000);
        return;
      }

      setPackages([]);
      setFilteredPackages([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchPackages();
    setTimeout(() => setRefreshing(false), 500);
  }

  function filterPackages() {
    let filtered = packages;

    if (searchQuery) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((pkg) =>
        selectedCategories.includes(pkg.category)
      );
    }

    filtered = filtered.filter(
      (pkg) =>
        pkg.discounted_price >= priceRange[0] &&
        pkg.discounted_price <= priceRange[1]
    );

    setFilteredPackages(filtered);
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
    setPriceRange([0, 5000]);
  }

  function toggleDescription(packageId: string) {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  }

  const categories = Array.from(new Set(packages.map((pkg) => pkg.category)));
  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SiteHeader />

      <section className="py-12 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-slate-900">
              Premium Packages
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Choose from our curated packages designed to boost your content
              strategy and maximize your reach.
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
                          placeholder="Search packages..."
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
                    {filteredPackages.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {packages.length}
                  </span>{" "}
                  packages
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
                  <p className="text-slate-500">Loading packages...</p>
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">
                    No packages found matching your filters.
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
                  {filteredPackages.map((pkg) => {
                    const discountPercentage = Math.round(
                      ((pkg.price - pkg.discounted_price) / pkg.price) * 100
                    );

                    return (
                      <Card
                        key={pkg._id}
                        className="flex flex-col hover:shadow-lg transition-all bg-white border-slate-200 hover:border-emerald-500">
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="shrink-0">
                              {pkg.imageUrl ? (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white">
                                  <Image
                                    src={pkg.imageUrl || "/placeholder.svg"}
                                    alt={`${pkg.name} logo`}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-emerald-600" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 text-base leading-tight mb-1 truncate">
                                {pkg.name}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {pkg.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              {pkg.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 text-xs">
                              Save {discountPercentage}%
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1 pb-3">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-700 mb-2">
                                Features:
                              </p>
                              <ul className="space-y-1">
                                {pkg.features
                                  .slice(0, 3)
                                  .map((feature, index) => (
                                    <li
                                      key={index}
                                      className="text-xs text-slate-600 flex items-start gap-1.5">
                                      <Check className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                      <span className="line-clamp-1">
                                        {feature}
                                      </span>
                                    </li>
                                  ))}
                                {pkg.features.length > 3 && (
                                  <li className="text-xs text-slate-500 pl-5">
                                    +{pkg.features.length - 3} more features
                                  </li>
                                )}
                              </ul>
                            </div>

                            <div className="pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Original</span>
                                <span className="line-through text-slate-400">
                                  ${pkg.price}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-slate-600 text-sm">
                                  Price
                                </span>
                                <span className="text-xl font-bold text-emerald-600">
                                  ${pkg.discounted_price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-3">
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            asChild>
                            <Link href={`/checkout?package=${pkg._id}`}>
                              Buy Now
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
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
