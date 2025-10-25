import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GUEST POST UP - Premium Guest Posts on High Authority Sites",
  description:
    "Get high-quality backlinks from authoritative websites. Boost your SEO with our curated guest posting opportunities.",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo/url-icon/url-icon.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/url-icon/url-icon.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/url-icon/url-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo/url-icon/url-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
