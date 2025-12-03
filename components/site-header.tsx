"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const { user, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/20 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-slate-900/95 supports-[backdrop-filter]:via-slate-800/95 supports-[backdrop-filter]:to-emerald-950/95">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-6 group">
          <div className="relative w-32 h-32 transition-transform group-hover:scale-110 duration-300">
            <Image
              src="/logo/logo.png"
              alt="GUESTPOSTUP Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
            Marketplace
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1 outline-none">
              Services
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem asChild>
                <Link
                  href="/guest-posting"
                  className="text-slate-300 hover:text-emerald-400 cursor-pointer">
                  Guest posting
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/packages"
                  className="text-slate-300 hover:text-emerald-400 cursor-pointer">
                  Premium Packages
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-slate-300 hover:text-emerald-400 hover:bg-slate-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
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
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/95 backdrop-blur border-t border-emerald-900/20">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/marketplace"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}>
                Marketplace
              </Link>
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2 flex items-center justify-between w-full">
                  Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesOpen && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href="/guest-posting"
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors py-2 block"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsServicesOpen(false);
                      }}>
                      Guest posting
                    </Link>
                    <Link
                      href="/packages"
                      className="text-sm text-slate-400 hover:text-emerald-400 transition-colors py-2 block"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsServicesOpen(false);
                      }}>
                      Premium Packages
                    </Link>
                  </div>
                )}
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}>
                Support
              </Link>
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-slate-700">
              {isLoading ? (
                <div className="h-9 w-full bg-slate-800 animate-pulse rounded-md" />
              ) : user ? (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 bg-transparent w-full">
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800 w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-slate-300 hover:text-emerald-400 hover:bg-slate-800 w-full">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
