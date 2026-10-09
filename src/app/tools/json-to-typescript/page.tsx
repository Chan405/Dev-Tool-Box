import { AppLink } from "@/components/layout/AppLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolFaq } from "@/components/tools/ToolFaq";
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
        <ToolPageFooter
          slug={tool.slug}
          aboutId="json-to-ts-about"
          aboutTitle="Generate TypeScript from JSON"
          faq={
            <ToolFaq
              id="json-to-ts-faq"
              items={[
                {
                  question: "How are optional properties inferred?",
                  answer:
                    "Optional properties appear only when the pasted JSON is a top-level array of objects and some objects omit a key. A single object treats every key it contains as required. When an array nested inside an object contains objects with different keys, each shape becomes its own interface and the property is a union of those interfaces inside an array type, such as (First | Second)[].",
                },
                {
                  question: "How are null values handled?",
                  answer:
                    "A null is typed as null. If the same field is a value in some objects and null in others, the generated type is a union that includes null.",
                },
                {
                  question: "Can JSON dates automatically become Date types?",
                  answer:
                    "No. JSON has no date type, so a date written as text stays a string. Change that to Date in your project if you need to.",
                },
              ]}
            />
          }
        >
          <ToolAboutParagraph>
            This JSON to TypeScript converter generates TypeScript interfaces from JSON objects or arrays. Nested objects
            become their own interfaces, and arrays become array types.             Converting a JSON array to TypeScript uses every object in the sample. Set the root type name, then copy or download the{" "}
            <code>.ts</code> file. Conversion runs in the browser.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            A property is optional only when some objects in a top-level array leave that key out. Null stays{" "}
            <code>null</code>, and a field that is sometimes null becomes a union. An empty array has no items to inspect, so its element
            type is <code>null</code> until you add a sample item. Dates remain strings because JSON does not record a
            date type. If you need runtime validation, generate a schema with the{" "}
            <AppLink href="/tools/json-to-zod" color="primary">
              JSON to Zod
            </AppLink>{" "}
            tool.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
