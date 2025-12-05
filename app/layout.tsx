import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "GUEST POST UP - Premium Guest Posts on High Authority Sites",
    template: "%s | GUEST POST UP",
  },
  description:
    "Get high-quality guest post backlinks from authoritative websites. Boost your SEO with premium guest posting opportunities. Buy guest posts on high DA sites for better rankings.",
  keywords: [
    "guest post",
    "guestpost",
    "guest posting",
    "guest post service",
    "buy guest posts",
    "high DA guest posts",
    "premium guest posting",
    "backlinks",
    "SEO backlinks",
    "guest post sites",
    "guest posting opportunities",
    "link building",
    "content marketing",
    "SEO services",
    "domain authority",
    "guest post outreach",
  ],
  authors: [{ name: "GUEST POST UP" }],
  creator: "GUEST POST UP",
  publisher: "GUEST POST UP",
  generator: "Next.js",
  applicationName: "GUEST POST UP",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  metadataBase: new URL("https://guestpostup.com"),
  alternates: {
    canonical: "/",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
  ],
  colorScheme: "light dark",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": "#10b981",
    "msapplication-config": "/browserconfig.xml",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://guestpostup.com",
    siteName: "GUEST POST UP",
    title: "GUEST POST UP - Premium Guest Posts on High Authority Sites",
    description:
      "Get high-quality guest post backlinks from authoritative websites. Boost your SEO with premium guest posting opportunities.",
    images: [
      {
        url: "/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "GUEST POST UP - Premium Guest Posting Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUEST POST UP - Premium Guest Posts on High Authority Sites",
    description:
      "Get high-quality guest post backlinks from authoritative websites. Boost your SEO with premium guest posting opportunities.",
    images: ["/logo/logo.png"],
    creator: "@guestpostup",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/logo/url-icon/url-icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        url: "/logo/url-icon/url-icon.jpg",
        sizes: "32x32",
        type: "image/jpeg",
      },
      {
        url: "/logo/url-icon/url-icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/logo/url-icon/url-icon.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: "your-verification-code",
  },
  category: "SEO Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>
        {/* Structured Data for SEO - Organization */}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GUEST POST UP",
            url: "https://guestpostup.com",
            logo: "https://guestpostup.com/logo/logo.png",
            description:
              "Premium guest posting service connecting businesses with high-authority websites for quality backlinks and SEO improvement.",
            contactPoint: {
              "@type": "ContactPoint",
              email: "info@guestpostup.com",
              contactType: "Customer Service",
            },
            sameAs: [
              "https://www.facebook.com/guestpostup/",
              "https://x.com/guestpostup/",
            ],
          })}
        </Script>

        {/* Structured Data for SEO - WebSite */}
        <Script
          id="structured-data-website"
          type="application/ld+json"
          strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "GUEST POST UP",
            url: "https://guestpostup.com",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate:
                  "https://guestpostup.com/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>

        {/* Structured Data for SEO - Service */}
        <Script
          id="structured-data-service"
          type="application/ld+json"
          strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Guest Posting Service",
            provider: {
              "@type": "Organization",
              name: "GUEST POST UP",
            },
            areaServed: "Worldwide",
            description:
              "Premium guest posting service for high-quality backlinks on authoritative websites. Boost your SEO with our curated guest posting opportunities.",
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          })}
        </Script>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16531887997"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16531887997');
            
            // Log tracking info to console (for debugging)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              console.log('🔵 Google Tag loaded successfully!');
              console.log('📊 Tracking ID: AW-16531887997');
              console.log('📈 View Analytics: https://analytics.google.com');
              console.log('💰 View Conversions: https://ads.google.com');
              console.log('🔍 Check dataLayer:', window.dataLayer);
            }
          `}
        </Script>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
