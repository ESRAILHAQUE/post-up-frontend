"use client";

import { useState, useEffect } from "react";
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
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Plus,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api/client";
import Swal from "sweetalert2";
import Link from "next/link";

export default function SupportTicketsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      fetchTickets();
    }
  }, [user, authLoading, router]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/support/user");
      console.log("[Support Tickets] Response:", response.data);
      setTickets(response.data.data || []);
    } catch (error) {
      console.error("[Support Tickets] Error fetching tickets:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch support tickets. Please try again.",
      });
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = searchQuery
      ? ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticketId?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: AlertCircle,
      },
      in_progress: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      resolved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
      },
      closed: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: CheckCircle2,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      order: "bg-purple-100 text-purple-800",
      payment: "bg-red-100 text-red-800",
      technical: "bg-blue-100 text-blue-800",
      account: "bg-green-100 text-green-800",
      billing: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Support Tickets
            </h1>
            <p className="text-gray-600">
              Manage your support requests and track their status
            </p>
          </div>
          <Link href="/dashboard/support">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter((t) => t.status === "open").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter((t) => t.status === "in_progress").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tickets.filter((t) => t.status === "resolved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets by subject or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-300 text-gray-900"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Your Support Tickets
            </CardTitle>
            <CardDescription className="text-gray-600">
              {filteredTickets.length} ticket(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700">Ticket ID</TableHead>
                      <TableHead className="text-gray-700">Subject</TableHead>
                      <TableHead className="text-gray-700">Category</TableHead>
                      <TableHead className="text-gray-700">Status</TableHead>
                      <TableHead className="text-gray-700">Created</TableHead>
                      <TableHead className="text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket._id}
                        className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-mono text-sm text-gray-600">
                          {ticket.ticketId}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {ticket.subject}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(
                              ticket.category
                            )} border-0`}>
                            {ticket.category.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {formatDate(ticket.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => {
                              // TODO: Open ticket details modal
                              Swal.fire({
                                title: "Ticket Details",
                                html: `
                                  <div class="text-left">
                                    <p><strong>Subject:</strong> ${
                                      ticket.subject
                                    }</p>
                                    <p><strong>Category:</strong> ${
                                      ticket.category
                                    }</p>
                                    <p><strong>Status:</strong> ${
                                      ticket.status
                                    }</p>
                                    <p><strong>Message:</strong> ${
                                      ticket.message
                                    }</p>
                                    <p><strong>Created:</strong> ${formatDate(
                                      ticket.createdAt
                                    )}</p>
                                  </div>
                                `,
                                showConfirmButton: false,
                                showCloseButton: true,
                              });
                            }}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery || statusFilter !== "all"
                    ? "No tickets found"
                    : "No support tickets yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Submit your first support ticket to get help with any issues."}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Link href="/dashboard/support">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Ticket
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
