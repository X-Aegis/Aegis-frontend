/**
 * Canonical production URL, used for metadataBase, sitemap.xml, and robots.txt.
 * Falls back to the Vercel-injected deployment URL, then localhost for local dev.
 * Set NEXT_PUBLIC_SITE_URL in production to the real custom domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const siteName = "XHedge (Aegis)";
export const siteDescription = "Stablecoin Volatility Shield for Weak Currencies";
