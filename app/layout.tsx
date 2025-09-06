import type { Metadata } from "next";
import Script from "next/script";
import Analytics from "../components/Analytics";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MD-View - Real-time Markdown Editor & Live Preview",
    template: "%s | MD-View"
  },
  description: "Free online markdown editor with live preview. Write, edit, and preview markdown in real-time with syntax highlighting, GitHub Flavored Markdown support, and responsive design. Perfect for developers, writers, and documentation.",
  keywords: [
    "markdown editor",
    "live preview",
    "real-time markdown",
    "online markdown editor",
    "markdown preview",
    "GitHub flavored markdown",
    "syntax highlighting",
    "markdown converter",
    "markdown writer",
    "documentation editor",
    "free markdown editor",
    "web markdown editor",
    "responsive markdown editor",
    "dark mode markdown"
  ],
  authors: [{ name: "MD-View Team", url: "https://github.com/celery94/md-view" }],
  creator: "MD-View",
  publisher: "MD-View",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/md-view-icon.svg", sizes: "any", type: "image/svg+xml" }
    ],
    shortcut: "/md-view-icon.svg",
    apple: "/md-view-icon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "MD-View - Real-time Markdown Editor & Live Preview",
    description: "Free online markdown editor with live preview. Write, edit, and preview markdown in real-time with syntax highlighting and GitHub Flavored Markdown support.",
    type: "website",
    locale: "en_US",
    url: "https://md-view.vercel.app",
    siteName: "MD-View",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MD-View - Real-time Markdown Editor & Live Preview"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD-View - Real-time Markdown Editor & Live Preview",
    description: "Free online markdown editor with live preview. Write, edit, and preview markdown in real-time with syntax highlighting.",
    images: ["/og-image.png"],
    creator: "@mdview",
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
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/md-view-icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-16x16.svg" type="image/svg+xml" sizes="16x16" />
        <link rel="canonical" href="https://md-view.vercel.app" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MD-View",
              "alternateName": "Markdown Editor with Live Preview",
              "description": "Free online markdown editor with live preview. Write, edit, and preview markdown in real-time with syntax highlighting and GitHub Flavored Markdown support.",
              "url": "https://md-view.vercel.app",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0.0",
              "author": {
                "@type": "Organization",
                "name": "MD-View Team"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Real-time markdown preview",
                "GitHub Flavored Markdown support",
                "Syntax highlighting",
                "Dark mode support",
                "Responsive design",
                "Free to use"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google tag (gtag.js) */}
        <Script
          id="gtag-src"
          src={`https://www.googletagmanager.com/gtag/js?id=G-PQ0PJ2D7EN`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PQ0PJ2D7EN');
          `}
        </Script>

        {/* Route change pageview tracking */}
        <Analytics />
        {children}
      </body>
    </html>
  );
}
