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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Wallet,
  Loader2,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";
import Swal from "sweetalert2";

export default function AddFundPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [accountBalance, setAccountBalance] = useState(0);
  const [fundRequests, setFundRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    paypalId: "",
    amount: "",
    message: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        userName: user.name,
        userEmail: user.email,
      }));
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch account balance
      try {
        const balanceResponse = await apiClient.get(`/users/balance/${user?.id}`);
        const balance = balanceResponse.data.data?.balance || 0;
        setAccountBalance(balance);
      } catch (balanceError) {
        console.error("[Add Fund] Error fetching balance:", balanceError);
        setAccountBalance(0);
      }

      // Fetch user's fund requests
      try {
        const requestsResponse = await apiClient.get("/fund-requests");
        const requestsData =
          requestsResponse.data.data?.requests ||
          requestsResponse.data.data ||
          [];
        setFundRequests(requestsData);
      } catch (requestError) {
        console.error("[Add Fund] Error fetching requests:", requestError);
        setFundRequests([]);
      }
    } catch (error) {
      console.error("[Add Fund] Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount < 10) {
        throw new Error("Amount must be at least $10");
      }

      await apiClient.post("/fund-requests", {
        userName: formData.userName,
        userEmail: formData.userEmail,
        paypalId: formData.paypalId,
        amount,
        message: formData.message,
      });

      await Swal.fire({
        icon: "success",
        title: "Fund Request Submitted!",
        text: "Your request has been sent to admin. You'll be notified once processed.",
        confirmButtonColor: "#10b981",
      });

      // Reset form
      setFormData({
        userName: user?.name || "",
        userEmail: user?.email || "",
        paypalId: "",
        amount: "",
        message: "",
      });

      // Refresh data
      fetchData();
    } catch (error: any) {
      console.error("[Add Fund] Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || error.message || "Failed to submit request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "invoice_sent":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <FileText className="h-3 w-3 mr-1" />
            Invoice Sent
          </Badge>
        );
      case "complete":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Complete
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
            Add Fund
          </h1>
          <p className="text-muted-foreground">
            Request to add funds to your account balance
          </p>
        </div>

        {/* Account Balance Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${accountBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for purchases
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Fund Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Fund Request</CardTitle>
              <CardDescription>
                Fill in the details below to request adding funds to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Name *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, userEmail: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paypalId">PayPal ID *</Label>
                  <Input
                    id="paypalId"
                    value={formData.paypalId}
                    onChange={(e) =>
                      setFormData({ ...formData, paypalId: e.target.value })
                    }
                    placeholder="your-paypal@email.com or PayPal.Me link"
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your PayPal email or PayPal.Me username
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      min="10"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="pl-7"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Minimum: $10
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Any additional notes or instructions..."
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Fund Request History */}
          <Card>
            <CardHeader>
              <CardTitle>Your Fund Requests</CardTitle>
              <CardDescription>
                Track the status of your fund requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fundRequests && fundRequests.length > 0 ? (
                <div className="space-y-3">
                  {fundRequests.map((request) => (
                    <div
                      key={request._id || request.id}
                      className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">
                          ${request.amount}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <strong>PayPal ID:</strong> {request.paypalId}
                        </p>
                        {request.message && (
                          <p>
                            <strong>Message:</strong> {request.message}
                          </p>
                        )}
                        <p>
                          <strong>Submitted:</strong>{" "}
                          {format(new Date(request.createdAt), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No fund requests yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}


