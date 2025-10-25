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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminSitesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSites, setTotalSites] = useState(0);
  const [sitesPerPage] = useState(12);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchSites(1);
    }
  }, [user, isLoading, router]);

  // Refresh sites when page becomes visible (e.g., when navigating back from new site page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && user.role === "admin") {
        fetchSites(1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  const fetchSites = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/sites?page=${page}&limit=${sitesPerPage}`
      );
      console.log("[Admin Sites] API Response:", response.data);

      const sitesData = response.data.data || [];
      const total =
        response.data.pagination?.total ||
        response.data.total ||
        sitesData.length;
      const totalPagesCount =
        response.data.pagination?.pages || Math.ceil(total / sitesPerPage);

      console.log("[Admin Sites] Sites to display:", sitesData);
      console.log("[Admin Sites] Total sites:", total);
      console.log("[Admin Sites] Total pages:", totalPagesCount);

      setSites(sitesData);
      setTotalSites(total);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching sites:", error);
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

    setDeletingId(id);

    try {
      await apiClient.delete(`/sites/${id}`);
      toast.success("Site deleted successfully!");
      fetchSites(currentPage);
    } catch (error: any) {
      console.error("Error deleting site:", error);
      toast.error(error.message || "Failed to delete site");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Manage Sites
            </h1>
            <p className="text-gray-600">
              Add and manage guest post opportunities
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchSites(1)}
              disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/admin/sites/new">Add New Site</Link>
            </Button>
          </div>
        </div>

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Sites</CardTitle>
            <CardDescription>Complete list of guest post sites</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading sites...</p>
              </div>
            ) : sites && sites.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>DA</TableHead>
                    <TableHead>DR</TableHead>
                    <TableHead>Traffic</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sites.map((site: any) => (
                    <TableRow key={site._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {site.name}
                          </p>
                          <p className="text-xs text-gray-500">{site.url}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-700">
                          {site.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-emerald-200 text-emerald-700">
                          {site.domainAuthority ||
                            site.domain_authority ||
                            "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700">
                          {site.domainRating || site.domain_rating || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {site.monthlyTraffic || site.monthly_traffic || "N/A"}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${site.price}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700"
                            asChild>
                            <Link href={`/admin/sites/${site._id}`}>Edit</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(site._id, site.name)}
                            disabled={deletingId === site._id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No sites yet</p>
              </div>
            )}
          </CardContent>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * sitesPerPage + 1} to{" "}
                {Math.min(currentPage * sitesPerPage, totalSites)} of{" "}
                {totalSites} sites
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchSites(currentPage - 1)}
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
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => fetchSites(pageNum)}
                        disabled={loading}
                        className={
                          currentPage === pageNum
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : ""
                        }>
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchSites(currentPage + 1)}
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
