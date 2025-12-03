"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileEdit, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminPagesPage() {
  const router = useRouter();

  const pages = [
    {
      id: "guest-posting",
      name: "Guest Posting Page",
      description: "Edit services page content, sections, and process steps",
      icon: FileText,
      href: "/admin/pages/guest-posting",
    },
  ];

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Page Content Management</h1>
            <p className="text-gray-600 mt-2">
              Manage and edit content for different pages on your website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <CardTitle className="text-xl">{page.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{page.description}</p>
                    <Button asChild className="w-full">
                      <Link href={page.href}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit Page
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}

