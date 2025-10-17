"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import apiClient from "@/lib/api/client";
import { AdminLayout } from "@/components/admin-layout";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Users,
  DollarSign,
  Globe,
  ArrowRight,
  Package as PackageIcon,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalSites: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    console.log("[v0] Admin page - isLoading:", isLoading, "user:", user);

    // Only fetch data when user is admin and not loading
    if (!isLoading && user && user.role === "admin") {
      console.log("[v0] Admin page - access granted");
      fetchDashboardData();
    }
  }, [user, isLoading]);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await apiClient.get("/orders");
      const orders = ordersRes.data.data || [];
      console.log("[Admin Dashboard] Orders:", orders.length);

      // Fetch users
      const usersRes = await apiClient.get("/users");
      const users = usersRes.data.data || [];
      console.log("[Admin Dashboard] Users:", users.length);

      // Fetch sites
      const sitesRes = await apiClient.get("/sites");
      const sites = sitesRes.data.data || [];
      console.log("[Admin Dashboard] Sites:", sites.length);

      // Calculate stats
      const totalRevenue = orders
        .filter((o: any) => o.paymentStatus === "paid")
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

      const pendingOrders = orders.filter(
        (o: any) => o.status === "pending"
      ).length;
      const inProgressOrders = orders.filter(
        (o: any) => o.status === "in_progress"
      ).length;

      setStats({
        totalOrders: orders.length,
        totalUsers: users.length,
        totalSites: sites.length,
        totalRevenue,
        pendingOrders,
        inProgressOrders,
      });

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error);
    }
  };

  console.log("[v0] Admin page - rendering dashboard");

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your guest post agency</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500">All time</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </div>
                <p className="text-xs text-gray-500">
                  {stats.pendingOrders} pending, {stats.inProgressOrders} in
                  progress
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </div>
                <p className="text-xs text-gray-500">Registered customers</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Active Sites
                </CardTitle>
                <Globe className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalSites}
                </div>
                <p className="text-xs text-gray-500">
                  Guest post opportunities
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/admin/orders"
                  className="text-emerald-600 hover:text-emerald-700">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`p-2 rounded-lg ${
                            order.orderType === "package"
                              ? "bg-purple-100"
                              : "bg-blue-100"
                          }`}>
                          {order.orderType === "package" ? (
                            <PackageIcon
                              className={`h-5 w-5 ${
                                order.orderType === "package"
                                  ? "text-purple-600"
                                  : "text-blue-600"
                              }`}
                            />
                          ) : (
                            <Globe className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {order.customerName}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {order.orderType === "package"
                                ? "Package"
                                : "Site"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {order.orderType === "package"
                              ? order.package?.name || "Package Order"
                              : order.site?.name || "Site Order"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-500">
                              {format(new Date(order.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ${order.totalAmount}
                          </p>
                          <Badge
                            variant={
                              order.status === "completed"
                                ? "default"
                                : order.status === "in_progress"
                                ? "secondary"
                                : order.status === "cancelled"
                                ? "destructive"
                                : "outline"
                            }
                            className={`text-xs ${
                              order.status === "completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "in_progress"
                                ? "bg-blue-100 text-blue-700"
                                : ""
                            }`}>
                            {order.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${order._id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
