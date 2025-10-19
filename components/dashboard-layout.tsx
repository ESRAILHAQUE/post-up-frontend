"use client"

import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import Link from "next/link"
import { LayoutDashboard, CreditCard, User, HelpCircle, Package } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="flex-1 container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/20 rounded-lg p-4 shadow-lg">
                <p className="text-sm font-medium mb-1 text-white">Signed in as</p>
                <p className="text-sm text-emerald-300 truncate">{user?.email}</p>
              </div>

              <nav className="space-y-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="/dashboard/my-orders">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="/dashboard/billing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
                  asChild
                >
                  <Link href="/dashboard/support">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Support
                  </Link>
                </Button>
              </nav>
            </div>
          </aside>

          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
