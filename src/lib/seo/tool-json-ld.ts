import { getSiteUrl } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools/registry";
import { getWebsiteJsonLdId } from "@/lib/seo/website-json-ld";

type BuildToolPageJsonLdInput = {
  slug: string;
  description: string;
};

export function buildToolPageJsonLd({ slug, description }: BuildToolPageJsonLdInput): Record<string, unknown> {
  const tool = getToolBySlug(slug);

  if (!tool) {
    throw new Error(`Unknown tool slug: ${slug}`);
  }

  const canonicalUrl = `${getSiteUrl()}/tools/${slug}`;
  const webpageId = `${canonicalUrl}#webpage`;
  const webApplicationId = `${canonicalUrl}#webapplication`;
  const websiteId = getWebsiteJsonLdId();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonicalUrl,
        name: tool.name,
        description,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": webApplicationId },
      },
      {
        "@type": "WebApplication",
        "@id": webApplicationId,
        name: tool.name,
        url: canonicalUrl,
        description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web browser",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
        },
      },
    ],
  };
}
