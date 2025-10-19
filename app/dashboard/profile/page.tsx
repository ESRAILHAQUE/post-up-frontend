"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Save, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      setEmail(user.email);
      setName(user.name || "");
    }
  }, [user, isLoading, router]);

  // Real-time password validation
  useEffect(() => {
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      setPasswordError("Passwords don't match");
    } else {
      setPasswordError("");
    }
  }, [newPassword, confirmPassword]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    console.log("Validating password change...");
    console.log("Current password length:", currentPassword.length);
    console.log("New password length:", newPassword.length);
    console.log("Confirm password length:", confirmPassword.length);
    console.log("Passwords match:", newPassword === confirmPassword);

    if (!currentPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your current password",
      });
      return;
    }

    if (!newPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a new password",
      });
      return;
    }

    if (!confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please confirm your new password",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "New passwords don't match",
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Calling changePassword API...");
      const result = await changePassword(currentPassword, newPassword);
      console.log("Password change result:", result);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Password updated successfully!",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordError("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.error || "Failed to update password",
        });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and security
          </p>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-emerald-500" />
              Account Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              View your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700">Name</Label>
              <Input
                value={name}
                disabled
                className="bg-gray-50 border-gray-200 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <Input
                value={email}
                disabled
                className="bg-gray-50 border-gray-200 text-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">Role</Label>
              <Input
                value={user.role}
                disabled
                className="bg-gray-50 border-gray-200 text-gray-700 capitalize"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Lock className="h-5 w-5 text-emerald-500" />
              Change Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-700">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-700">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  className="bg-white border-gray-200 text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className={`bg-white border-gray-200 text-gray-900 ${
                    passwordError ? "border-red-500" : ""
                  }`}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  passwordError !== ""
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
