"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("[AdminAuthGuard] isLoading:", isLoading, "user:", user);

    // Don't redirect while still loading authentication state
    if (isLoading) {
      return;
    }

    // If no user or user is not admin, redirect to main login
    if (!user || user.role !== "admin") {
      console.log("[AdminAuthGuard] Redirecting to login");
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not admin
  if (!user || user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
