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

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    } else if (!isLoading && user && user.role === "admin") {
      fetchSites();
    }
  }, [user, isLoading, router]);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/sites");
      console.log("[Admin Sites] API Response:", response.data);
      console.log("[Admin Sites] Sites data:", response.data.data);
      console.log("[Admin Sites] Data array:", response.data.data?.data);

      // Fix: Use response.data.data directly (not response.data.data.data)
      const sitesData = response.data.data || [];
      console.log("[Admin Sites] Sites to display:", sitesData);
      setSites(sitesData);
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
      fetchSites();
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
          <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/admin/sites/new">Add New Site</Link>
          </Button>
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
                        {(
                          site.monthlyTraffic || site.monthly_traffic
                        )?.toLocaleString() || "N/A"}
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
        </Card>
      </div>
    </AdminLayout>
  );
}
