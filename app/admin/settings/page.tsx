"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminLayout } from "@/components/admin-layout";
import { AdminAuthGuard } from "@/components/admin-auth-guard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const { user, changePassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  // Handle confirm password change with real-time validation
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    if (value && newPassword && value !== newPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  // Handle new password change with real-time validation
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);

    if (confirmPassword && value && value !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  // Helper function to format role for display
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "buyer":
        return "Buyer";
      case "seller":
        return "Seller";
      default:
        return "User";
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate current password
    if (!currentPassword.trim()) {
      toast({
        title: "❌ Current Password Required",
        description: "Please enter your current password",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Validate new password
    if (!newPassword.trim()) {
      toast({
        title: "❌ New Password Required",
        description: "Please enter a new password",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "❌ Password Too Short",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      toast({
        title: "❌ Confirm Password Required",
        description: "Please confirm your new password",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword || passwordMatchError) {
      toast({
        title: "❌ Passwords Don't Match",
        description:
          "New password and confirm password do not match. Please check and try again.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      toast({
        title: "❌ Same Password",
        description:
          "New password must be different from your current password",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    const result = await changePassword(currentPassword, newPassword);

    console.log("Password change result:", result);

    if (result.success) {
      console.log("Showing success toast");
      toast({
        title: "✅ Password Changed Successfully!",
        description: "Your password has been updated successfully.",
        duration: 3000,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMatchError("");
    } else {
      toast({
        title: "❌ Password Change Failed",
        description:
          result.error ||
          "Failed to change password. Please check your current password and try again.",
        variant: "destructive",
        duration: 5000,
      });
    }

    setIsLoading(false);
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Settings
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your admin account settings
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your admin account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={getRoleDisplayName(user?.role || "user")}
                    disabled
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your admin password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => handleNewPasswordChange(e.target.value)}
                      required
                      minLength={8}
                      className={`mt-1.5 ${
                        passwordMatchError ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        handleConfirmPasswordChange(e.target.value)
                      }
                      required
                      minLength={8}
                      className={`mt-1.5 ${
                        passwordMatchError ? "border-red-500" : ""
                      }`}
                    />
                    {passwordMatchError && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordMatchError}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !!passwordMatchError ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {isLoading ? "Changing Password..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
