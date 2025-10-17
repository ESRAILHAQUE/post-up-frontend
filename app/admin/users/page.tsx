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
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  if (authLoading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Users
          </h1>
          <p className="text-gray-600">View all registered users</p>
        </div>

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">All Users</CardTitle>
            <CardDescription>Complete list of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            ) : users && users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell className="font-medium text-gray-900">
                        {u.name}
                      </TableCell>
                      <TableCell className="text-gray-700">{u.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                          className={
                            u.role === "admin"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-700"
                          }>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.isSuspended ? (
                          <Badge variant="destructive">Suspended</Badge>
                        ) : u.isActive ? (
                          <Badge className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(u.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (
                              confirm(
                                `Are you sure you want to ${
                                  u.isSuspended ? "activate" : "suspend"
                                } this user?`
                              )
                            ) {
                              try {
                                await apiClient.put(
                                  `/users/${u._id}/${
                                    u.isSuspended ? "activate" : "suspend"
                                  }`
                                );
                                window.location.reload();
                              } catch (error) {
                                alert("Failed to update user");
                              }
                            }
                          }}>
                          {u.isSuspended ? "Activate" : "Suspend"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No users yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
