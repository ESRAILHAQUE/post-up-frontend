"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import apiClient from "@/lib/api/client";
import { AdminLayout } from "@/components/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ExternalLink } from "lucide-react";

export default function AdminOrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersPerPage] = useState(12);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchOrders();
    }
  }, [user, isLoading, router]);

  const fetchOrders = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders?page=${page}&limit=${ordersPerPage}`);
      console.log("[Admin Orders] API Response:", response.data);
      
      const ordersData = response.data.data || [];
      const total = response.data.pagination?.total || response.data.total || ordersData.length;
      const totalPagesCount = response.data.pagination?.pages || Math.ceil(total / ordersPerPage);
      
      console.log("[Admin Orders] Orders count:", ordersData.length);
      console.log("[Admin Orders] Total orders:", total);
      console.log("[Admin Orders] Total pages:", totalPagesCount);
      
      setOrders(ordersData);
      setTotalOrders(total);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Orders
          </h1>
          <p className="text-gray-600">View and update all customer orders</p>
        </div>

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Orders</CardTitle>
            <CardDescription>
              Complete list of guest post orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading orders...</p>
              </div>
            ) : orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-xs text-gray-600">
                        {order.orderId || order._id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.orderType === "package" ? "Package" : "Site"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {order.orderType === "package"
                              ? order.package?.name || "Package"
                              : order.site?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.orderType === "package"
                              ? order.package?.category || ""
                              : order.site?.category || ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.targetUrl ? (
                          <a
                            href={order.targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 hover:underline text-xs flex items-center gap-1">
                            {order.targetUrl?.length > 25
                              ? order.targetUrl.substring(0, 25) + "..."
                              : order.targetUrl}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
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
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : ""
                          }>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${order.totalAmount}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700"
                          asChild>
                          <Link href={`/admin/orders/${order._id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders yet</p>
              </div>
            )}
          </CardContent>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
                {Math.min(currentPage * ordersPerPage, totalOrders)} of{" "}
                {totalOrders} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(currentPage - 1)}
                  disabled={currentPage === 1 || loading}>
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchOrders(pageNum)}
                        disabled={loading}
                        className={currentPage === pageNum ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
