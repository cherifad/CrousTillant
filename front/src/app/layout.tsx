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

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Crous'tillant",
  description: "Le menu du RU, plus simplement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
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
            {children}
          </main>
          <Footer />
          <Toaster />
          <Script
            defer
            src="https://ru-stats.servperso.me/script.js"
            data-website-id="c778fc13-9451-48b1-946a-aef37fa91256"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
