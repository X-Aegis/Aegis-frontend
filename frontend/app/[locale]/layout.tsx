import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Placeholder production domain -- override with the real deployment URL
// via NEXT_PUBLIC_SITE_URL once one is assigned. Consumed here and by
// app/sitemap.ts / app/robots.ts so there is a single source of truth.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaegis.app";
const SITE_TITLE = "X-Aegis — Stablecoin Volatility Shield";
const SITE_DESCRIPTION = "Stablecoin Volatility Shield for Weak Currencies";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | X-Aegis",
  },
  description: SITE_DESCRIPTION,
  keywords: ["X-Aegis", "stablecoin", "volatility hedge", "Stellar", "Soroban", "DeFi", "vault"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "X-Aegis",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
