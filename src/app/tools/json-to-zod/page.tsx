import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JsonToZodTool } from "./JsonToZodTool";

const SLUG = "json-to-zod";

const SEO_DESCRIPTION =
  "Convert JSON examples into Zod schemas online. Generate TypeScript-friendly Zod validation schemas directly in your browser.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JSON to Zod Schema Converter",
  description: SEO_DESCRIPTION,
  keywords: ["json to zod", "zod schema generator", "json zod", "runtime validation", "typescript zod"],
});

export default function JsonToZodPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <JsonToZodTool />
        <ToolPageFooter slug={tool.slug} aboutId="json-to-zod-about" aboutTitle="Turn JSON into Zod schemas">
          <ToolAboutParagraph>
            Start from a real JSON payload and get a Zod schema you can paste into Node, Next.js, or API route handlers.
            The generator maps strings, numbers, booleans, nulls, arrays, and nested objects to the matching Zod helpers.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            Like the rest of DevToolbox, conversion runs locally—your sample JSON never leaves the page. Rename the root
            schema, then copy or download the TypeScript-ready output.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
