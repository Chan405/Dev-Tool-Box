import { getSiteUrl, site } from "@/lib/site";

export function getWebsiteJsonLdId(): string {
  return `${getSiteUrl()}#website`;
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        name: site.name,
        url: siteUrl,
        description: site.description,
        inLanguage: "en",
      },
    ],
  };
}
