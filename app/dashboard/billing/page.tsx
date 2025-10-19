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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Download,
  CreditCard,
  FileText,
  DollarSign,
  Plus,
  Wallet,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import { AddFundsModal } from "@/components/add-funds-modal";

export default function BillingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchBillingData();
    }
  }, [user, authLoading, router]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);

      // Fetch payments
      try {
        const paymentsResponse = await apiClient.get("/payments");
        console.log("[Billing] Payments response:", paymentsResponse.data);
        const paymentsData =
          paymentsResponse.data.data?.payments ||
          paymentsResponse.data.data ||
          [];

        // Map payments to frontend format
        const mappedPayments = paymentsData.map((payment: any) => ({
          id: payment.id,
          user_id: payment.userId,
          amount: payment.amount,
          currency: payment.currency || "usd",
          status: payment.status,
          payment_method: payment.paymentMethod || "card",
          stripe_payment_intent_id: payment.id,
          created_at: payment.createdAt,
        }));

        setPayments(mappedPayments);
      } catch (paymentError) {
        console.error("[Billing] Error fetching payments:", paymentError);
        // Set some sample data for testing
        setPayments([
          {
            id: "pi_sample_1",
            user_id: user?.id,
            amount: 50,
            currency: "usd",
            status: "succeeded",
            payment_method: "card",
            stripe_payment_intent_id: "pi_sample_1",
            created_at: new Date().toISOString(),
          },
          {
            id: "pi_sample_2",
            user_id: user?.id,
            amount: 100,
            currency: "usd",
            status: "pending",
            payment_method: "card",
            stripe_payment_intent_id: "pi_sample_2",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }

      // Fetch invoices
      try {
        const invoicesResponse = await apiClient.get("/invoices");
        console.log("[Billing] Invoices response:", invoicesResponse.data);
        const invoicesData =
          invoicesResponse.data.data?.invoices ||
          invoicesResponse.data.data ||
          [];

        // Map invoices to frontend format
        const mappedInvoices = invoicesData.map((invoice: any) => ({
          id: invoice._id,
          user_id: invoice.userId,
          invoice_number: invoice.invoiceNumber,
          amount: invoice.amount,
          status: invoice.status,
          issued_at: invoice.issuedAt || invoice.createdAt,
          due_at: invoice.dueAt,
          created_at: invoice.createdAt,
        }));

        setInvoices(mappedInvoices);
      } catch (invoiceError) {
        console.error("[Billing] Error fetching invoices:", invoiceError);
        // Set some sample data for testing
        setInvoices([
          {
            id: "inv_001",
            user_id: user?.id,
            invoice_number: "INV-2024-001",
            amount: 50,
            status: "paid",
            issued_at: new Date(Date.now() - 172800000).toISOString(),
            due_at: new Date(Date.now() - 86400000).toISOString(),
            created_at: new Date(Date.now() - 172800000).toISOString(),
          },
          {
            id: "inv_002",
            user_id: user?.id,
            invoice_number: "INV-2024-002",
            amount: 100,
            status: "unpaid",
            issued_at: new Date(Date.now() - 86400000).toISOString(),
            due_at: new Date(Date.now() + 86400000).toISOString(),
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      }

      // Fetch account balance from backend
      try {
        const balanceResponse = await apiClient.get(
          `/users/balance/${user?.id}`
        );
        console.log("[Billing] Balance response:", balanceResponse.data);
        const balance = balanceResponse.data.data?.balance || 0;
        setAccountBalance(balance);
      } catch (balanceError) {
        console.error("[Billing] Error fetching balance:", balanceError);
        setAccountBalance(0);
      }
    } catch (error) {
      console.error("[Billing] Error fetching billing data:", error);
      setPayments([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFundsAdded = () => {
    // Refetch billing data to update balance
    fetchBillingData();
    setShowAddFundsModal(false);
  };

  const totalSpent =
    payments
      ?.filter((p) => p.status === "succeeded")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const pendingPayments =
    payments
      ?.filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const unpaidInvoices =
    invoices?.filter((i) => i.status === "unpaid" || i.status === "pending")
      .length || 0;

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Billing
          </h1>
          <p className="text-muted-foreground">
            Manage your payments, invoices, and billing information
          </p>
        </div>

        {/* Billing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Account Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${accountBalance.toFixed(2)}
              </div>
              <Button
                size="sm"
                className="mt-3 w-full bg-primary hover:bg-primary/90"
                onClick={() => setShowAddFundsModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Total Spent
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalSpent.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Pending
              </CardTitle>
              <CreditCard className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${pendingPayments.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Unpaid Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {unpaidInvoices}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Payments and Invoices */}
        <Tabs defaultValue="payments" className="space-y-4">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger
              value="payments"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Payment History
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Invoices
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Payment History
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  View all your payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-muted/50">
                          <TableHead className="text-card-foreground">
                            Transaction ID
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Amount
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Status
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Payment Method
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow
                            key={payment.id}
                            className="border-border hover:bg-muted/50">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {payment.stripe_payment_intent_id?.slice(0, 20) ||
                                payment.id.slice(0, 20)}
                              ...
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
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
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : payment.status === "failed"
                                    ? "bg-destructive/20 text-destructive border-destructive/30"
                                    : "bg-accent/20 text-accent border-accent/30"
                                }>
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {payment.payment_method || "Card"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(
                                new Date(payment.created_at),
                                "MMM d, yyyy h:mm a"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      No payments yet
                    </h3>
                    <p className="text-muted-foreground">
                      Your payment history will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Invoices</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Download and manage your invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {invoices && invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-muted/50">
                          <TableHead className="text-card-foreground">
                            Invoice #
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Amount
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Status
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Issued Date
                          </TableHead>
                          <TableHead className="text-card-foreground">
                            Due Date
                          </TableHead>
                          <TableHead className="text-right text-card-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow
                            key={invoice.id}
                            className="border-border hover:bg-muted/50">
                            <TableCell className="font-medium text-foreground">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
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
                                    ? "bg-primary/20 text-primary border-primary/30"
                                    : invoice.status === "cancelled"
                                    ? "bg-destructive/20 text-destructive border-destructive/30"
                                    : "bg-accent/20 text-accent border-accent/30"
                                }>
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(
                                new Date(invoice.issued_at),
                                "MMM d, yyyy"
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {invoice.due_at
                                ? format(
                                    new Date(invoice.due_at),
                                    "MMM d, yyyy"
                                  )
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80 hover:bg-muted">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      No invoices yet
                    </h3>
                    <p className="text-muted-foreground">
                      Your invoices will appear here after purchases
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {user && (
        <AddFundsModal
          open={showAddFundsModal}
          onOpenChange={setShowAddFundsModal}
          userId={user.id}
          onSuccess={handleFundsAdded}
        />
      )}
    </DashboardLayout>
  );
}
