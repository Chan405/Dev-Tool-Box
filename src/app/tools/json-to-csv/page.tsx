import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JsonToCsvTool } from "./JsonToCsvTool";

const SLUG = "json-to-csv";

const SEO_DESCRIPTION =
  "Convert JSON arrays to CSV online for free. Export JSON objects to properly formatted CSV with correct escaping.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JSON to CSV Converter – Free Online Tool",
  description: SEO_DESCRIPTION,
  keywords: ["json to csv", "convert json to csv", "json array to csv", "export json csv"],
});

export default function JsonToCsvPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <JsonToCsvTool />
        <ToolPageFooter slug={tool.slug} aboutId="json-to-csv-about" aboutTitle="Export JSON arrays to CSV">
          <ToolAboutParagraph>
            Provide a JSON array of objects and this tool builds a header row from the union of keys, then writes one CSV
            row per object. Commas, quotes, and line breaks inside values are escaped so the file opens cleanly in Excel
            or Google Sheets.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            Missing properties become empty cells instead of breaking the export. All conversion happens on your device—
            paste, convert, then copy or download the <code>.csv</code> file.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
