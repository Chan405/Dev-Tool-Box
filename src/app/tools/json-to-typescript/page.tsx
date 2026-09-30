import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JsonToTypescriptTool } from "./JsonToTypescriptTool";

const SLUG = "json-to-typescript";

const SEO_DESCRIPTION =
  "Convert JSON to TypeScript interfaces online for free. Paste your JSON and generate clean TypeScript types directly in your browser.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JSON to TypeScript Converter – Generate Interfaces",
  description: SEO_DESCRIPTION,
  keywords: ["json to typescript", "json typescript generator", "generate typescript from json", "json interface"],
});

export default function JsonToTypescriptPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <JsonToTypescriptTool />
        <ToolPageFooter slug={tool.slug} aboutId="json-to-ts-about" aboutTitle="Generate TypeScript from JSON">
          <ToolAboutParagraph>
            Paste a JSON object or array and this tool infers property types, nested objects, and arrays to produce
            readable TypeScript interfaces. It is useful when you receive API samples, config files, or logs and want
            strongly typed models without writing types by hand.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            Processing happens entirely in your browser. Adjust the root type name, then copy or download the generated
            <code>.ts</code> file for your project.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
