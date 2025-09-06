import type { Metadata } from "next";
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
  title: "md-view",
  description: "A real-time markdown editor and preview application",
  keywords: ["markdown", "editor", "preview", "real-time", "md-view"],
  authors: [{ name: "md-view" }],
  icons: {
    icon: "/md-view-icon.svg",
    shortcut: "/md-view-icon.svg",
    apple: "/md-view-icon.svg",
  },
  openGraph: {
    title: "md-view",
    description: "A real-time markdown editor and preview application",
    type: "website",
  },
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
