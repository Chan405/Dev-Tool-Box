import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JsonToZodTool } from "./JsonToZodTool";

const SLUG = "json-to-zod";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JSON to Zod Schema Generator",
  description:
    "Create Zod schemas from JSON examples in your browser. Generate z.object, z.array, and nested validators locally.",
  keywords: ["json to zod", "zod schema generator", "json zod", "runtime validation", "typescript zod"],
});

export default function JsonToZodPage() {
  const tool = requireAvailableTool(SLUG);

  return (
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
  );
}
