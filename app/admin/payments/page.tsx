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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function AdminPaymentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchPayments();
    }
  }, [user, isLoading, router]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/payments");
      setPayments(response.data.data?.payments || response.data.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
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
            Manage Payments
          </h1>
          <p className="text-gray-600">View all payment transactions</p>
        </div>

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Payments</CardTitle>
            <CardDescription>Complete payment history</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading payments...</p>
              </div>
            ) : payments && payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs text-gray-600">
                        {payment.id?.slice(0, 20) || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {payment.orderId || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Order Reference
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        Payment
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${payment.amount}
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
                              ? "bg-emerald-100 text-emerald-700"
                              : payment.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : ""
                          }>
                          {payment.status}
                        </Badge>
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
                <p className="text-gray-500">No payments yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
