"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import apiClient from "@/lib/api/client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await apiClient.get(`/auth/verify-email?token=${token}`);

      if (response.data.success) {
        setStatus("success");
        setMessage(response.data.message);
      } else {
        setStatus("error");
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      // Get email from localStorage or prompt user
      const email =
        localStorage.getItem("userEmail") ||
        prompt("Please enter your email address:");

      if (!email) {
        setMessage("Email address is required");
        return;
      }

      const response = await apiClient.post("/auth/resend-verification", {
        email,
      });

      if (response.data.success) {
        setMessage(
          "Verification email sent successfully! Please check your inbox."
        );
      } else {
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Failed to resend verification email"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {status === "loading" && (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                )}
                {status === "success" && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
                {status === "error" && (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>

              <CardTitle className="text-2xl">
                {status === "loading" && "Verifying Email..."}
                {status === "success" && "Email Verified!"}
                {status === "error" && "Verification Failed"}
              </CardTitle>

              <CardDescription>
                {status === "loading" &&
                  "Please wait while we verify your email address"}
                {status === "success" &&
                  "Your email has been successfully verified"}
                {status === "error" && "We couldn't verify your email address"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {message && (
                <Alert
                  variant={status === "success" ? "default" : "destructive"}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {status === "success" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your account is now active! You can login and start using
                    PostUp.
                  </p>
                  <Button onClick={handleGoToLogin} className="w-full">
                    Go to Login
                  </Button>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The verification link may have expired or is invalid. You
                    can request a new verification email.
                  </p>

                  <div className="space-y-2">
                    <Button
                      onClick={handleResendVerification}
                      disabled={isResending}
                      variant="outline"
                      className="w-full">
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleGoHome}
                      variant="ghost"
                      className="w-full">
                      Go to Home
                    </Button>
                  </div>
                </div>
              )}

              {status === "loading" && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    This may take a few moments...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <CardTitle className="text-2xl">Loading...</CardTitle>
                <CardDescription>
                  Please wait while we load the verification page
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <SiteFooter />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
