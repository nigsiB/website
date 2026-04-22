const DEFAULT_DEV_SITE_URL = "http://localhost:3000";

function normalizeUrl(url: string): string {
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

function resolveSiteUrl(): string {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!rawUrl) {
    return DEFAULT_DEV_SITE_URL;
  }

  return normalizeUrl(rawUrl).replace(/\/$/, "");
}

export const siteConfig = {
  name: "Nigsib Portfolio",
  title: "Nigsib Portfolio | Multidisciplinary Design",
  description:
    "Award-winning multidisciplinary designer delivering web, branding, print, and exhibition work that ships and performs in the real world.",
  url: resolveSiteUrl(),
  locale: "en_GB",
};
