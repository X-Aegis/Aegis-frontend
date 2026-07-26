import type { MetadataRoute } from "next";

// Placeholder production domain -- see app/[locale]/layout.tsx for the same
// fallback and the note on overriding it via NEXT_PUBLIC_SITE_URL.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaegis.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
