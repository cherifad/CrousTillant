import type { Metadata } from "next";
import { Poppins as FontSans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/app/theme-provider";
import Announcement from "@/components/announcement";
import { cn } from "@/lib/utils";
import Script from "next/script";
import SnowFall from "@/components/snow-fall";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Crous'tillant",
  applicationName: "Crous'tillant",
  appleWebApp: true,
  description: "Le menu du RU, plus simplement.",
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png" },
      { url: "/icons/apple-touch-icon.png", sizes: "152x152" },
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
      { url: "/icons/apple-touch-icon.png", sizes: "167x167" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/apple-touch-icon.png",
        color: "#5bbad5",
      },
      { rel: "shortcut icon", url: "/favicon.ico" },
    ],
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary",
    title: "Crous'tillant",
    description: "Le menu du RU, plus simplement.",
    images: "https://croustillant.vercel.app/icons/android-chrome-192x192.png",
    creator: "@cherifad",
  },
  openGraph: {
    type: "website",
    title: "Crous'tillant",
    description: "Le menu du RU, plus simplement.",
    siteName: "Crous'tillant",
    url: "https://croustillant.vercel.app/",
    images: [{ url: "https://croustillant.vercel.app/icons/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <Analytics/>
      <SpeedInsights/>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased relative",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="p-4 pb-20 lg:p-24 grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Header />
            <Announcement />
            <SnowFall />
            {children}
          </main>
          <Footer />
          <Toaster />
          {/* <Script
            defer
            src="#"
            data-website-id="c778fc13-9451-48b1-946a-aef37fa91256"
          /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
