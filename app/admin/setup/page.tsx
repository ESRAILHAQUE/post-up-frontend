"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import apiClient from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user, firebaseUser } = useAuth();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      // Check if any admin exists
      const response = await apiClient.get("/users/check-admin");
      setHasAdmin(response.data.data.hasAdmin);

      if (user && user.role === "admin") {
        router.push("/admin");
        return;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const makeCurrentUserAdmin = async () => {
    if (!user) {
      setError("You must be logged in to become an admin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiClient.put(`/users/profile/${user.id}/make-admin`);
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to make user admin");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Admin Setup</CardTitle>
          <CardDescription className="text-slate-400">
            {hasAdmin
              ? "An admin already exists"
              : "Set up your first admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="bg-emerald-500/10 border-emerald-500/20">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <AlertDescription className="text-emerald-400">
                Admin access granted! Redirecting to admin panel...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {hasAdmin ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                An admin account already exists. If you need admin access,
                please contact the existing administrator.
              </p>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/")}>
                Go to Homepage
              </Button>
            </div>
          ) : !user ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                You must be logged in to set up an admin account.
              </p>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={() => router.push("/auth/login")}>
                Sign In
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">
                No admin account exists yet. Click the button below to make your
                account ({user.email}) the first admin.
              </p>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={makeCurrentUserAdmin}
                disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Become Admin"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
