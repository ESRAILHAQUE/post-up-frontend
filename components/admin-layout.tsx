"use client"

import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Globe, Users, CreditCard, Settings, FileText, PackageIcon, Wallet, FileEdit, Link2 } from "lucide-react"
import { usePathname } from "next/navigation"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <SiteHeader />
      <div className="flex-1 container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-emerald-700">Admin Panel</p>
              </div>

              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin") && pathname === "/admin"
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/orders")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/sites")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/sites">
                    <Globe className="mr-2 h-4 w-4" />
                    Sites
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/packages")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/packages">
                    <PackageIcon className="mr-2 h-4 w-4" />
                    Packages
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/blog")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/blog">
                    <FileText className="mr-2 h-4 w-4" />
                    Blog Posts
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/pages")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/pages/guest-posting">
                    <FileEdit className="mr-2 h-4 w-4" />
                    Guest Posting
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/link-building")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/link-building">
                    <Link2 className="mr-2 h-4 w-4" />
                    Link Building Plans
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/users")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/payments")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/payments">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payments
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/fund-requests")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/fund-requests">
                    <Wallet className="mr-2 h-4 w-4" />
                    Fund Requests
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive("/admin/settings")
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  asChild
                >
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
