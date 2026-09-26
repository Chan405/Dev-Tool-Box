import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools/registry";

type ToolPageMetadataInput = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
};

export function createToolPageMetadata({ slug, title, description, keywords }: ToolPageMetadataInput): Metadata {
  const tool = getToolBySlug(slug);

  return {
    title,
    description: tool?.description ?? description,
    keywords,
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      type: "website",
    },
  };
}
