"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiClient from "@/lib/api/client";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

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
  createdAt: string;
  updatedAt: string;
}

export default function AdminPackagesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchPackages();
    }
  }, [user, isLoading, router]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/packages");
      console.log("[Admin Packages] API Response:", response.data);
      console.log("[Admin Packages] Packages data:", response.data.data);

      // Fix: Check if response.data.data is an array
      let packagesData = [];
      if (response.data.data && Array.isArray(response.data.data)) {
        packagesData = response.data.data;
      } else if (
        response.data.data &&
        response.data.data.packages &&
        Array.isArray(response.data.data.packages)
      ) {
        packagesData = response.data.data.packages;
      }

      console.log("[Admin Packages] Packages to display:", packagesData);
      setPackages(packagesData);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await apiClient.delete(`/packages/${id}`);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error: any) {
      console.error("Error deleting package:", error);
      toast.error(error.response?.data?.message || "Failed to delete package");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/packages/${id}`, {
        isActive: !currentStatus,
      });
      toast.success(
        `Package ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchPackages();
    } catch (error: any) {
      console.error("Error updating package:", error);
      toast.error(error.response?.data?.message || "Failed to update package");
    }
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Packages</h1>
            <p className="text-muted-foreground">
              Add and manage premium packages for your customers.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/packages/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Package
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-slate-500">Loading packages...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No packages found</p>
              <Button asChild>
                <Link href="/admin/packages/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Package
                </Link>
              </Button>
            </div>
          ) : (
            filteredPackages.map((pkg) => (
              <Card key={pkg._id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {pkg.category}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/packages/${pkg._id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleActive(pkg._id, pkg.isActive)}>
                          {pkg.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(pkg._id, pkg.name)}
                          className="text-red-600 focus:text-red-600"
                          disabled={deletingId === pkg._id}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingId === pkg._id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">{pkg.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Sites:</span>
                        <span className="font-medium">
                          {pkg.features.length} sites
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Original Price:</span>
                        <span className="line-through text-slate-400">
                          ${pkg.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          Discounted Price:
                        </span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-emerald-600">
                            ${pkg.discounted_price}
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            Save{" "}
                            {Math.round(
                              ((pkg.price - pkg.discounted_price) / pkg.price) *
                                100
                            )}
                            %
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-600 flex items-center">
                            <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                        {pkg.features.length > 3 && (
                          <li className="text-sm text-slate-500">
                            +{pkg.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild>
                      <Link href={`/admin/packages/${pkg._id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg._id, pkg.name)}
                      disabled={deletingId === pkg._id}
                      className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
