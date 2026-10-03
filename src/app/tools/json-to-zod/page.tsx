import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolFaq } from "@/components/tools/ToolFaq";
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
        <ToolPageFooter
          slug={tool.slug}
          aboutId="json-to-zod-about"
          aboutTitle="Turn JSON into Zod schemas"
          faq={
            <ToolFaq
              id="json-to-zod-faq"
              items={[
                {
                  question: "Does this validate my API response automatically?",
                  answer:
                    "No. It writes a schema from the sample you paste. You still call that schema from your own code when a response arrives.",
                },
                {
                  question: "How are optional fields generated?",
                  answer:
                    "A field is optional when the input is an array of objects and at least one object is missing that key. Keys on a single object are required.",
                },
                {
                  question: "Does it detect email, UUID, or date formats automatically?",
                  answer:
                    "No. Those values stay strings. Add checks such as email or UUID yourself if you need them, and date-like strings are not turned into dates.",
                },
              ]}
            />
          }
        >
          <ToolAboutParagraph>
            Generate a Zod schema from JSON when you want a runtime validation schema for an API response, a Node
            handler, or a Next.js route. Nested objects and arrays map to <code>z.object</code> and{" "}
            <code>z.array</code>. The file starts with <code>import {"{ z }"} from &quot;zod&quot;;</code>. Rename the
            root schema, then copy or download it. The sample stays in the browser.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            TypeScript types describe data at compile time, while Zod schemas can validate data at runtime. In an array
            of objects, a key that some items omit is marked <code>.optional()</code>. Mixed values on one field become{" "}
            <code>z.union</code>. Email, UUID, and datetime formats are not inferred, and a numeric string is not
            coerced into a number—it stays <code>z.string()</code> until you tighten the schema.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
