import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolFaq } from "@/components/tools/ToolFaq";
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
        <ToolPageFooter
          slug={tool.slug}
          aboutId="json-to-csv-about"
          aboutTitle="Export JSON arrays to CSV"
          faq={
            <ToolFaq
              id="json-to-csv-faq"
              items={[
                {
                  question: "What JSON format can I convert?",
                  answer:
                    "A non-empty JSON array of objects, such as [{\"name\":\"Ada\"}]. A single object or an empty array will not convert.",
                },
                {
                  question: "What happens to nested objects?",
                  answer:
                    "Nested objects and arrays stay in one cell as JSON text. They are not split into extra columns.",
                },
                {
                  question: "What happens when objects have different keys?",
                  answer:
                    "The header includes every key that appears on any object. A row that lacks a key gets an empty cell for that column.",
                },
              ]}
            />
          }
        >
          <ToolAboutParagraph>
            This JSON to CSV converter takes a JSON array of objects and writes one row per object. The header is the
            union of every key. Commas, quotes, and line breaks inside values are escaped so you can convert JSON to
            CSV for Excel or Google Sheets. A missing property becomes an empty cell. Paste, convert, then copy or
            download the <code>.csv</code> file. Conversion stays on your device.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            A single object is not accepted, and neither is an empty array. Nested JSON in a CSV cell stays JSON text
            rather than expanding into more columns.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
