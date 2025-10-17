"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import apiClient from "@/lib/api/client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Download,
  ShoppingBag,
  CreditCard,
  FileText,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders");
        console.log("[v0] Orders fetch result:", response.data);
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("[v0] Error fetching orders:", error);
        setOrders([]);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await apiClient.get("/payments");
        console.log("[v0] Payments fetch result:", response.data);
        // Handle both possible response formats
        const paymentsData =
          response.data.data?.payments || response.data.data || [];
        setPayments(paymentsData);
      } catch (error) {
        console.error("[v0] Error fetching payments:", error);
        setPayments([]);
      }
    };

    const fetchInvoices = async () => {
      try {
        const response = await apiClient.get("/invoices");
        console.log("[v0] Invoices fetch result:", response.data);
        // Handle both possible response formats
        const invoicesData =
          response.data.data?.invoices || response.data.data || [];
        setInvoices(invoicesData);
      } catch (error) {
        console.error("[v0] Error fetching invoices:", error);
        setInvoices([]);
      }
    };

    if (user) {
      fetchOrders();
      fetchPayments();
      fetchInvoices();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inProgressOrders = orders.filter(
    (o) => o.status === "in_progress"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalSpent = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <DashboardLayout userEmail={user.email || "Unknown"}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your guest post orders and track progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {orders.length}
              </div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                In Progress
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {inProgressOrders + pendingOrders}
              </div>
              <p className="text-xs text-gray-600">
                {pendingOrders} pending, {inProgressOrders} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Completed
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {completedOrders}
              </div>
              <p className="text-xs text-gray-600">Successfully published</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Spent
              </CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600">
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600">
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600">
              Invoices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Your Orders</CardTitle>
                <CardDescription className="text-gray-600">
                  Track the status of your guest post orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700">Site</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                        <TableHead className="text-gray-700">Amount</TableHead>
                        <TableHead className="text-gray-700">Date</TableHead>
                        <TableHead className="text-right text-gray-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, index) => (
                        <TableRow
                          key={order.id || `order-${index}`}
                          className="border-gray-200">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">
                                {order.siteName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {order.category}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "in_progress"
                                  ? "secondary"
                                  : "outline"
                              }
                              className={
                                order.status === "completed"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : order.status === "in_progress"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : "bg-yellow-100 text-yellow-700 border-yellow-200"
                              }>
                              {order.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            ${order.amount}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start building your backlink profile today
                    </p>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      asChild>
                      <Link href="/marketplace">Browse Sites</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Payment History</CardTitle>
                <CardDescription className="text-gray-600">
                  View all your payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700">Order</TableHead>
                        <TableHead className="text-gray-700">Amount</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                        <TableHead className="text-gray-700">
                          Payment Method
                        </TableHead>
                        <TableHead className="text-gray-700">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment, index) => (
                        <TableRow
                          key={payment.id || `payment-${index}`}
                          className="border-gray-200">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">
                                {payment.orderId.slice(0, 8)}
                              </p>
                              <p className="text-xs text-gray-600">
                                Order #{payment.orderId.slice(0, 8)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            ${payment.amount} {payment.currency.toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === "succeeded"
                                  ? "default"
                                  : payment.status === "failed"
                                  ? "destructive"
                                  : "outline"
                              }
                              className={
                                payment.status === "succeeded"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : payment.status === "failed"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {payment.paymentMethod || "Card"}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {format(new Date(payment.createdAt), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      No payments yet
                    </h3>
                    <p className="text-gray-600">
                      Your payment history will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Invoices</CardTitle>
                <CardDescription className="text-gray-600">
                  Download and manage your invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700">
                          Invoice #
                        </TableHead>
                        <TableHead className="text-gray-700">Order</TableHead>
                        <TableHead className="text-gray-700">Amount</TableHead>
                        <TableHead className="text-gray-700">Status</TableHead>
                        <TableHead className="text-gray-700">Date</TableHead>
                        <TableHead className="text-right text-gray-700">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice, index) => (
                        <TableRow
                          key={invoice.id || `invoice-${index}`}
                          className="border-gray-200">
                          <TableCell className="font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">
                                {invoice.orderId.slice(0, 8)}
                              </p>
                              <p className="text-xs text-gray-600">
                                Order #{invoice.orderId.slice(0, 8)}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            ${invoice.amount}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                invoice.status === "paid"
                                  ? "default"
                                  : invoice.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                              }
                              className={
                                invoice.status === "paid"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : invoice.status === "cancelled"
                                  ? "bg-red-100 text-red-700 border-red-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                              }>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {format(new Date(invoice.issuedAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      No invoices yet
                    </h3>
                    <p className="text-gray-600">
                      Your invoices will appear here after purchases
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
