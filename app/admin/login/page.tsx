"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect to main login page
 * All users (admin, buyer, seller) use the same login page
 * Role-based redirect happens automatically after login
 */
export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);

  return null;
}
