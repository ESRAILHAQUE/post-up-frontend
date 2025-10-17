"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export function SiteHeader() {
  const { user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/20 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-slate-900/95 supports-[backdrop-filter]:via-slate-800/95 supports-[backdrop-filter]:to-emerald-950/95">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-12 h-12 transition-transform group-hover:scale-110 duration-300">
            <Image
              src="/postup-logo.svg"
              alt="PostUp Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white tracking-tight">
              PostUp
            </span>
            <span className="text-xs text-emerald-400 font-medium -mt-1">
              Guest Posting Platform
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Marketplace
          </Link>
          <Link
            href="/packages"
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Packages
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Blog
          </Link>
          <Link
            href="/support"
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-32 bg-slate-800 animate-pulse rounded-md" />
          ) : user ? (
            <>
              <Button
                variant="outline"
                asChild
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 bg-transparent">
                <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
