import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppLink } from "@/components/layout/AppLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolAboutSection } from "@/components/tools/ToolAboutSection";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { API_RESPONSE_EXAMPLE } from "@/lib/examples/tool-examples";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { requireAvailableTool } from "@/lib/tools/require-available-tool";
import { JsonToZodTool } from "../json-to-zod/JsonToZodTool";

const SLUG = "api-response-to-zod";

const SEO_DESCRIPTION =
  "Generate a Zod schema from an API response JSON sample. Convert nested JSON into Zod validation code directly in your browser.";

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "API Response to Zod Schema Generator",
  description: SEO_DESCRIPTION,
  keywords: ["api response to zod", "zod schema from api response", "generate zod schema from json"],
});

export default function ApiResponseToZodPage() {
  const tool = requireAvailableTool(SLUG);

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <Box component="section" aria-labelledby="api-response-example" sx={{ mb: 3, maxWidth: 720 }}>
          <Typography id="api-response-example" component="h2" variant="h2" sx={{ mb: 1.5 }}>
            API response example
          </Typography>
          <ToolAboutParagraph>
            Start from a response body like this one, or paste JSON from your own API. Choose Load example in the
            converter to fill the input, then generate the schema.
          </ToolAboutParagraph>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 2,
              overflow: "auto",
              borderRadius: 1,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
              color: "text.primary",
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            {API_RESPONSE_EXAMPLE}
          </Box>
        </Box>

        <JsonToZodTool
          example={API_RESPONSE_EXAMPLE}
          analyticsSlug={SLUG}
          inputId="api-response-to-zod-input"
          outputId="api-response-to-zod-output"
        />

        <ToolAboutSection id="api-response-zod-schema" title="How this sample becomes a Zod schema">
          <ToolAboutParagraph>
            The converter reads the pasted JSON with the same{" "}
            <AppLink href="/tools/json-to-zod" color="primary">
              JSON to Zod
            </AppLink>{" "}
            logic used on the general tool. With the default root name <code>RootSchema</code>, this sample becomes a
            root object and a nested schema for <code>profile</code>.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            <code>id</code> is a JSON number, so it becomes <code>z.number()</code>. <code>name</code> and{" "}
            <code>email</code> are strings, so both become <code>z.string()</code>. <code>roles</code> is an array of
            strings, so it becomes <code>z.array(z.string())</code>. <code>profile</code> is an object, so{" "}
            <code>active</code> becomes <code>z.boolean()</code> on a nested schema, and the root object references that
            schema. The file starts with <code>import {"{ z }"} from &quot;zod&quot;;</code> and exports the root schema.
            Every key in this object is required, because the sample never omits one.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            Rename the root schema before you generate if you want a name that matches the endpoint. If you need
            TypeScript interfaces instead of a runtime Zod schema, use{" "}
            <AppLink href="/tools/json-to-typescript" color="primary">
              JSON to TypeScript
            </AppLink>
            .
          </ToolAboutParagraph>
        </ToolAboutSection>

        <ToolAboutSection id="api-response-zod-limits" title="What this tool can and cannot infer">
          <ToolAboutParagraph>
            One response describes the values in that paste. A later response can add fields, leave fields out, or use
            different types. The generated schema is a starting point for your project. It does not document or verify
            the API&apos;s full contract, and this page does not call your API.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            A date written as text stays <code>z.string()</code> until you transform it. An email address or a string
            that looks like a UUID also stays <code>z.string()</code>. The converter does not add{" "}
            <code>z.string().email()</code> or a UUID check. A number stored as a string, such as{" "}
            <code>&quot;123&quot;</code>, stays <code>z.string()</code> rather than becoming <code>z.number()</code>.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            Optional fields appear when the sample gives evidence for them. On one object, each key that is present is
            required. When the input is an array of objects and at least one object omits a key, that key is marked{" "}
            <code>.optional()</code>. If the same field holds different JSON types across those objects, the converter
            emits <code>z.union</code> for the types it saw.
          </ToolAboutParagraph>
        </ToolAboutSection>

        <ToolFaq
          id="api-response-zod-faq"
          items={[
            {
              question: "How do I generate a Zod schema from an API response?",
              answer:
                "Paste a JSON object or array from a sample response, set the root schema name if you want a different export, and choose Generate Zod schema. Conversion runs in your browser. Copy the result or download it as schema.ts.",
            },
            {
              question: "Can I use the generated schema in Next.js?",
              answer:
                "Yes. The output imports z from \"zod\". Use it in a route handler, server action, or other TypeScript module after you install Zod in that project. The same file works in Node.js and other TypeScript codebases.",
            },
            {
              question: "Does the tool validate the API response?",
              answer:
                "It checks that the pasted text is JSON, then writes a schema from that sample. It does not request the API. The schema checks data only after you call it from your own code, and one sample does not prove every response the API can return.",
            },
            {
              question: "Can Zod infer optional fields from one response?",
              answer:
                "A single object treats every present key as required. A field becomes optional when you paste an array of objects and at least one object leaves that key out.",
            },
            {
              question: "Does it detect dates, UUIDs, or email addresses automatically?",
              answer:
                "No. Dates, UUID-like strings, and email addresses stay z.string(). A numeric string stays z.string() as well. Add a tighter check in the generated schema if your project needs one.",
            },
          ]}
        />

        <RelatedTools currentSlug={tool.slug} />
      </ToolLayout>
    </>
  );
}
