"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { ExternalLink, Search, Filter, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import apiClient from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/orders");
      console.log("[My Orders] API Response:", response.data);

      // Map backend data to frontend format
      const ordersData = (response.data.data || []).map((order: any) => ({
        id: order._id || order.id,
        user_id: order.userId,
        site_id: order.siteId,
        sites: order.site
          ? {
              name: order.site.name || order.siteName,
              domain_authority: order.site.domainAuthority,
              domain_rating: order.site.domainRating,
              category: order.site.category,
            }
          : {
              name: order.siteName || "Unknown Site",
              domain_authority: 0,
              domain_rating: 0,
              category: order.category || "Unknown",
            },
        target_url: order.targetUrl || "",
        article_topic: order.articleTopic,
        special_instructions: order.specialInstructions,
        status: order.status,
        total_amount: order.totalAmount || order.amount,
        created_at: order.createdAt,
        payment_status: order.paymentStatus,
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error("[My Orders] Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchQuery
      ? order.sites?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.target_url?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inProgressOrders = orders.filter(
    (o) => o.status === "in_progress"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-600">
            View and manage all your guest post orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingOrders}
              </div>
              <p className="text-xs text-gray-600 mt-1">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {inProgressOrders}
              </div>
              <p className="text-xs text-gray-600 mt-1">Being worked on</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {completedOrders}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Successfully published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Filter Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by site name or URL..."
                    className="pl-10 bg-white border-gray-300 text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Orders</CardTitle>
            <CardDescription className="text-gray-600">
              Complete history of your guest post purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders && filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-gray-700">Order ID</TableHead>
                      <TableHead className="text-gray-700">Site</TableHead>
                      <TableHead className="text-gray-700">
                        Target URL
                      </TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Amount</TableHead>
                      <TableHead className="text-gray-700">Date</TableHead>
                      <TableHead className="text-right text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-mono text-xs text-gray-600">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.sites?.name || "Unknown Site"}
                            </p>
                            <p className="text-xs text-gray-600">
                              DA {order.sites?.domain_authority} • DR{" "}
                              {order.sites?.domain_rating}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <a
                            href={order.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-1">
                            {order.target_url.length > 30
                              ? order.target_url.substring(0, 30) + "..."
                              : order.target_url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell>
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
                            className={
                              order.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : order.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          ${order.total_amount}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {format(new Date(order.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : orders.length > 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  No orders match your filters
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="bg-white">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start building your backlink profile today
                </p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  asChild>
                  <Link href="/marketplace">Browse Sites</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
