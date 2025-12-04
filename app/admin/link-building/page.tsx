"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminLayout } from "@/components/admin-layout";
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
  Link2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface LinkBuildingPlan {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  linksPerMonth: string;
  features: string[];
  popular: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLinkBuildingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<LinkBuildingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchPlans();
    }
  }, [user, isLoading, router]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/link-building");
      const plansData = response.data.data || [];
      setPlans(plansData);
    } catch (error) {
      console.error("Error fetching link building plans:", error);
      toast.error("Failed to fetch link building plans");
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
      await apiClient.delete(`/link-building/${id}`);
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast.error(error.response?.data?.message || "Failed to delete plan");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.put(`/link-building/${id}`, {
        isActive: !currentStatus,
      });
      toast.success(
        `Plan ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchPlans();
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast.error(error.response?.data?.message || "Failed to update plan");
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-3xl font-bold">Link Building Plans</h1>
            <p className="text-muted-foreground">
              Manage pricing plans displayed on the homepage.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/link-building/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Plan
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-4 text-slate-500">Loading plans...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Link2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 mb-4">No plans found</p>
              <Button asChild>
                <Link href="/admin/link-building/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Plan
                </Link>
              </Button>
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <Card
                key={plan._id}
                className={`relative ${
                  plan.popular ? "border-2 border-emerald-500" : ""
                }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-emerald-500 text-white">POPULAR</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`mt-1 ${
                            plan.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-50 text-slate-500"
                          }`}>
                          {plan.isActive ? "Active" : "Inactive"}
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
                          <Link href={`/admin/link-building/${plan._id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleActive(plan._id, plan.isActive)}>
                          {plan.isActive ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan._id, plan.name)}
                          className="text-red-600 focus:text-red-600"
                          disabled={deletingId === plan._id}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingId === plan._id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Price:</span>
                        <span className="text-xl font-bold text-emerald-600">
                          ${plan.price} / mo
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Links/Month:</span>
                        <Badge variant="secondary" className="bg-slate-100">
                          {plan.linksPerMonth}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-slate-600 flex items-center">
                            <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li className="text-sm text-slate-500">
                            +{plan.features.length - 3} more
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
                      <Link href={`/admin/link-building/${plan._id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(plan._id, plan.name)}
                      disabled={deletingId === plan._id}
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

