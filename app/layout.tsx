import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import Analytics from "../components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.md-view.com/'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  appLinks: {
    web: {
      url: 'https://www.md-view.com/',
    },
  },
  applicationName: 'MD-View',
  title: {
    default: "MD-View - Real-time Markdown Editor & Live Preview",
    template: "%s | MD-View"
  },
  description:
    "Free online markdown editor with live preview. Write, edit, and preview markdown in real-time with syntax highlighting and GFM. Import .md, export HTML, and print to PDF.",
  keywords: [
    "markdown editor",
    "live preview",
    "real-time markdown",
    "online markdown editor",
    "markdown preview",
    "GitHub flavored markdown",
    "syntax highlighting",
    "markdown converter",
    "markdown edit",
    "markdown preview editor",
    "export html",
    "export pdf",
    "markdown to html",
    "markdown to pdf",
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
    description:
      "Online markdown editor with live preview. Edit markdown, export HTML, and print to PDF. Syntax highlighting and GitHub Flavored Markdown included.",
    type: "website",
    locale: "en_US",
    url: "https://www.md-view.com/",
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
    description:
      "Edit markdown with live preview. Export HTML and print to PDF.",
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
  category: "technology",
};

const webAppStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MD-View",
  alternateName: "Markdown Editor with Live Preview",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url: "https://www.md-view.com/",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.md-view.com/",
  },
  inLanguage: "en",
  description:
    "Free online markdown editor with live preview. Edit, preview, and export markdown with GitHub Flavored Markdown support, syntax highlighting, and responsive themes.",
  image: "https://www.md-view.com/og-image.png",
  screenshot: "https://www.md-view.com/og-image.png",
  keywords: [
    "markdown editor",
    "live preview markdown",
    "online markdown editor",
    "github flavored markdown",
    "markdown to html",
    "markdown to pdf",
    "syntax highlighting",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  softwareVersion: "1.0.0",
  publisher: {
    "@type": "Organization",
    name: "MD-View",
    url: "https://www.md-view.com/",
    logo: {
      "@type": "ImageObject",
      url: "https://www.md-view.com/md-view-icon.svg",
      width: 128,
      height: 128,
    },
    sameAs: [
      "https://github.com/celery94/md-view",
    ],
  },
  featureList: [
    "Real-time markdown preview",
    "GitHub Flavored Markdown support",
    "Syntax highlighting",
    "Import markdown files",
    "Export HTML",
    "Print-ready document view",
    "Responsive interface",
  ],
  potentialAction: [
    {
      "@type": "ViewAction",
      target: "https://www.md-view.com/",
      name: "Launch the markdown editor",
    },
    {
      "@type": "ReadAction",
      target: "https://www.md-view.com/guide",
      name: "Explore the MD-View guide",
    },
  ],
} as const;

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
        <link rel="canonical" href="https://www.md-view.com/" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppStructuredData),
          }}
        />
      </head>
      <body className={`antialiased`}>
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
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
