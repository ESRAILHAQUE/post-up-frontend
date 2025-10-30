"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updatePassword,
  User as FirebaseUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "../firebase/config";
import apiClient from "../api/client";

interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  name: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;
  emailSignup: (
    email: string,
    password: string,
    name: string,
    role?: "buyer" | "seller"
  ) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }>;
  emailLogin: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }>;
  googleSignIn: () => Promise<{
    success: boolean;
    user?: User;
    token?: string;
    error?: string;
  }>;
  logout: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token and user data FIRST
    const checkStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        const storedToken = localStorage.getItem("auth_token");

        if (storedUser && storedToken) {
          // Restore user from localStorage immediately
          const userData = JSON.parse(storedUser);
          console.log("[Auth] Restoring user from localStorage:", userData);
          setUser(userData);
          setIsLoading(false); // User is authenticated from localStorage
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error restoring auth:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        return false;
      }
    };

    // Try to restore from localStorage first
    const hasStoredAuth = checkStoredAuth();

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        // Only fetch from backend if we don't have stored data
        if (!hasStoredAuth) {
          // Fetch user profile from backend
          try {
            const response = await apiClient.get(
              `/users/profile/${firebaseUser.uid}`
            );
            const userData = response.data.data;
            setUser(userData);

            // Store in localStorage for persistence
            localStorage.setItem("auth_user", JSON.stringify(userData));
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Create user profile with default data
            const userData: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "user",
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "User",
            };
            setUser(userData);
            localStorage.setItem("auth_user", JSON.stringify(userData));
          }
        }
      } else {
        // Only clear if not logged in via email/JWT (check for stored token)
        const storedUser = localStorage.getItem("auth_user");
        const storedToken = localStorage.getItem("auth_token");

        // If user logged in via email/JWT, keep them logged in
        if (storedUser && storedToken) {
          console.log("[Auth] Keeping JWT-based auth on Firebase state change");
          // Don't clear anything, user is authenticated via JWT
        } else {
          // No stored auth, clear everything
          setFirebaseUser(null);
          setUser(null);
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
        }
      }

      // Only set loading to false if we haven't already done so from localStorage
      if (!hasStoredAuth) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch user profile from backend
      try {
        const response = await apiClient.get(
          `/users/profile/${userCredential.user.uid}`
        );
        const userData = response.data.data;

        // Get Firebase token for API calls
        const token = await userCredential.user.getIdToken();

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_user", JSON.stringify(userData));
        }

        return { success: true, user: userData };
      } catch (error) {
        // If profile doesn't exist, create default user data
        const userData: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || "",
          role: "user",
          name: userCredential.user.displayName || email.split("@")[0],
        };

        // Get Firebase token
        const token = await userCredential.user.getIdToken();

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("auth_user", JSON.stringify(userData));
        }

        return { success: true, user: userData };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error.message || "Failed to login. Please check your credentials.",
      };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Create user profile in backend
      const userData: User = {
        id: userCredential.user.uid,
        email,
        role: "user",
        name,
      };

      try {
        await apiClient.post("/users/profile", userData);
      } catch (error) {
        console.error("Error creating user profile:", error);
      }

      // Get Firebase token
      const token = await userCredential.user.getIdToken();

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return { success: true, user: userData };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.message || "Failed to create account.",
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }

      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const emailSignup = async (
    email: string,
    password: string,
    name: string,
    role?: "buyer" | "seller"
  ) => {
    try {
      const response = await apiClient.post("/auth/signup/email", {
        email,
        password,
        name,
        role: role || "buyer",
      });

      const { user: userData, token } = response.data.data;
      setUser(userData);

      // Store token and user data
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return { success: true, user: userData, token };
    } catch (error: any) {
      console.error("Email signup error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to create account.",
      };
    }
  };

  const emailLogin = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login/email", {
        email,
        password,
      });

      const { user: userData, token } = response.data.data;
      setUser(userData);

      // Store token and user
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return { success: true, user: userData, token };
    } catch (error: any) {
      console.error("Email login error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Failed to login. Please check your credentials.",
      };
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Send to backend to create/login user
      const response = await apiClient.post("/auth/google", {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
        photoURL: firebaseUser.photoURL,
      });

      const { user: userData, token } = response.data.data;
      setUser(userData);

      // Store token and user
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }

      return { success: true, user: userData, token };
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to sign in with Google.",
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      // Debug: Check what tokens are available
      const jwtToken = localStorage.getItem("auth_token");
      console.log("JWT Token available:", !!jwtToken);
      console.log("Firebase user:", !!firebaseUser);
      console.log("User:", user);

      // Call backend API to change password in both MongoDB and Firebase
      const response = await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword: newPassword,
      });

      console.log("Password change API response:", response.data);

      // Update password in Firebase client (if user logged in via Firebase)
      if (firebaseUser && firebaseUser.email) {
        try {
          const credential = EmailAuthProvider.credential(
            firebaseUser.email,
            currentPassword
          );
          await reauthenticateWithCredential(firebaseUser, credential);
          await updatePassword(firebaseUser, newPassword);
        } catch (firebaseError) {
          console.log(
            "Firebase client password update skipped:",
            firebaseError
          );
          // Continue even if Firebase client update fails
          // Backend has already updated it
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error("Change password error:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          error.message ||
          "Failed to change password",
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email) {
        return { success: false, error: "Email is required" };
      }
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error("Reset password error:", error);
      return {
        success: false,
        error:
          error?.message ||
          "Failed to send reset email. Please check the address.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        signup,
        emailSignup,
        emailLogin,
        googleSignIn,
        logout,
        changePassword,
        resetPassword,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
