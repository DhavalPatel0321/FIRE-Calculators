import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/app/seo";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Deterministic FIRE planning tools for Traditional, Coast, Barista, Lean, and Fat FIRE.",
  applicationName: SITE_NAME,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: SITE_NAME,
    description:
      "Compare Traditional, Coast, Barista, Lean, and Fat FIRE from one shared scenario.",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "FIRE Calculators planner preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Compare Traditional, Coast, Barista, Lean, and Fat FIRE from one shared scenario.",
    images: [absoluteUrl("/opengraph-image")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <div className="flex min-h-screen flex-col bg-slate-50">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
          <Analytics />
        </TooltipProvider>
      </body>
    </html>
  );
}
