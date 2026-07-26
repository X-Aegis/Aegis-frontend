import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

// Placeholder production domain -- see app/[locale]/layout.tsx for the same
// fallback and the note on overriding it via NEXT_PUBLIC_SITE_URL.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xaegis.app";

// Static routes only -- /vaults/[id] is omitted since vault ids are
// on-chain data, not known at build time.
const STATIC_ROUTES = ["", "/bridge", "/settings"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}/${locale}${route}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
