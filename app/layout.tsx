import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Marketing CRM",
  description: "Agent-powered marketing CRM dashboard",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI Marketing CRM",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-[100dvh] font-sans antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
