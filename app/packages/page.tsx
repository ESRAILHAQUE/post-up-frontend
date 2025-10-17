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
import { Search, X, Package, RefreshCw, Check } from "lucide-react";
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
    } catch (error) {
      console.error("[Packages] Error fetching packages:", error);
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

  const categories = Array.from(new Set(packages.map((pkg) => pkg.category)));
  const hasActiveFilters =
    searchQuery ||
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000;

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Premium Packages
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Choose from our curated packages designed to boost your content
              strategy and maximize your reach.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Filters
                  </h3>
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

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <Label className="text-slate-700 mb-2 block">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search packages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <Label className="text-slate-700 mb-3 block">
                      Categories
                    </Label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div
                          key={category}
                          className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
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

                  {/* Price Range */}
                  <div>
                    <div className="space-y-3">
                      <Label className="text-slate-700">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={5000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="lg:col-span-3">
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
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <p className="mt-4 text-slate-500">Loading packages...</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPackages.map((pkg) => (
                    <Card
                      key={pkg._id}
                      className="flex flex-col hover:shadow-lg transition-all bg-white border-slate-200 hover:border-emerald-500">
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4 mb-3">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                              {pkg.name}
                            </h3>
                            <p className="text-sm text-slate-500 truncate">
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
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-2">
                              What's Included:
                            </h4>
                            <ul className="space-y-1">
                              {pkg.features.map((feature, index) => (
                                <li
                                  key={index}
                                  className="flex items-center text-sm text-slate-600">
                                  <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-slate-500 line-through">
                                  ${pkg.price}
                                </span>
                                <span className="text-2xl font-bold text-emerald-600 ml-2">
                                  ${pkg.discounted_price}
                                </span>
                              </div>
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                Save ${pkg.price - pkg.discounted_price}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-3">
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          asChild>
                          <Link href={`/checkout?package=${pkg._id}`}>
                            Buy Package
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
      </main>
      <SiteFooter />
    </div>
  );
}
