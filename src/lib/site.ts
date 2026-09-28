export const site = {
  name: "DevToolbox",
  tagline: "Developer tools that get out of your way",
  description:
    "Small utilities for formatting, inspecting, and transforming data. Available tools run locally in your browser, with no account and no uploads.",
} as const;

const DEFAULT_SITE_URL = "https://dev-tool-box-lime.vercel.app";

/** Canonical origin for sitemap, robots, and absolute metadata URLs. */
export function getSiteUrl(): string {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!candidate) {
    return DEFAULT_SITE_URL;
  }

  const withProtocol =
    candidate.startsWith("http://") || candidate.startsWith("https://")
      ? candidate
      : `https://${candidate}`;

  return withProtocol.replace(/\/$/, "");
}
