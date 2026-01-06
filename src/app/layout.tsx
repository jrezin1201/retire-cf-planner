import React from "react";
import "./globals.css";
import "./theme.css";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { siteConfig } from "@/config/site-config";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - Calculate When You Can Retire`,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={robotoMono.variable} data-theme="blue" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'blue';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <ErrorBoundary>
          <SessionProvider>
            {children}
            <FeedbackWidget />
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
