import type { Metadata } from "next";
import { site } from "@/lib/site";

type ToolPageMetadataInput = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
};

export function createToolPageMetadata({ slug, title, description, keywords }: ToolPageMetadataInput): Metadata {
  const canonicalPath = `/tools/${slug}`;
  const openGraphTitle = `${title} · ${site.name}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: openGraphTitle,
      description,
      type: "website",
      url: canonicalPath,
    },
    twitter: {
      card: "summary",
      title: openGraphTitle,
      description,
    },
  };
}
