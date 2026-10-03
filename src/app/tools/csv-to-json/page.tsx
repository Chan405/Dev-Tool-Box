import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolFaq } from "@/components/tools/ToolFaq";
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
        <ToolPageFooter
          slug={tool.slug}
          aboutId="csv-to-json-about"
          aboutTitle="Convert CSV to JSON safely"
          faq={
            <ToolFaq
              id="csv-to-json-faq"
              items={[
                {
                  question: "Why are CSV values strings?",
                  answer:
                    "CSV is text. The converter does not guess that a cell is a number or boolean, so each value is a string. Empty cells become null.",
                },
                {
                  question: "What happens if my CSV has no header row?",
                  answer:
                    "Turn off “First row is headers”. The output is then an array of arrays, one inner array per row, instead of an array of objects.",
                },
                {
                  question: "Can I convert tab-separated data?",
                  answer:
                    "No. Columns are split on commas. Tab-separated or semicolon-separated text is not treated as separate columns.",
                },
              ]}
            />
          }
        >
          <ToolAboutParagraph>
            Use this CSV to JSON converter to turn comma-separated rows into JSON objects. With “First row is headers”
            on, that row supplies the keys and each following row becomes an object. For CSV without headers, turn the
            option off and the result is an array of arrays. Quoted commas and escaped double quotes stay inside the
            field they belong to.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            Every cell is a string, and an empty cell becomes <code>null</code>. The parser expects commas between
            columns, not tabs or semicolons. You can convert CSV in the browser; the text is not uploaded.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
