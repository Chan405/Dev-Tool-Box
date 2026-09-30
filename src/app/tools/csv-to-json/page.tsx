import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { CsvToJsonTool } from "./CsvToJsonTool";

const SLUG = "csv-to-json";

const SEO_DESCRIPTION =
  "Convert CSV data to JSON online for free. Turn CSV rows into JSON objects with header support directly in your browser.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "CSV to JSON Converter – Free Online Tool",
  description: SEO_DESCRIPTION,
  keywords: ["csv to json", "convert csv to json", "csv parser", "spreadsheet to json"],
});

export default function CsvToJsonPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <CsvToJsonTool />
        <ToolPageFooter slug={tool.slug} aboutId="csv-to-json-about" aboutTitle="Convert CSV to JSON safely">
          <ToolAboutParagraph>
            Paste CSV from spreadsheets, exports, or logs and get pretty-printed JSON. The parser respects quoted fields,
            commas inside quotes, and escaped double quotes—so values like addresses or descriptions stay intact.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            By default the first row becomes object keys. Toggle that option if your file is headerless. Everything runs
            locally in your browser with no upload step.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
