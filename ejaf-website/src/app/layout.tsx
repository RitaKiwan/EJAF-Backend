import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "../app/globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocaleSync } from "@/components/locale-sync";
import { SiteMotion } from "@/components/site-motion";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "EJAF Technology",
    template: "%s | EJAF Technology",
  },
  description:
    "Premium frontend for EJAF Technology with typed content, bilingual support, and Laravel-ready APIs.",
  icons: {
    icon: [
      {
        url: "/favicon.ico?v=1",
        href: "/favicon.ico?v=1",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <LocaleSync />
          <SiteMotion>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </SiteMotion>
        </Suspense>
      </body>
    </html>
  );
}
