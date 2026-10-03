import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { ToolFaq } from "@/components/tools/ToolFaq";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { ToolPageFooter } from "@/components/tools/ToolPageFooter";
import { buildToolPageJsonLd } from "@/lib/seo/tool-json-ld";
import { createToolPageMetadata } from "@/lib/tools/tool-page-metadata";
import { getToolBySlug } from "@/lib/tools/registry";
import { JsonFormatter } from "./JsonFormatter";

const SLUG = "json-formatter";

const SEO_DESCRIPTION =
  "Format, beautify, minify, and validate JSON online for free. Process JSON locally in your browser with DevToolbox—nothing is uploaded to a server.";

const tool = getToolBySlug(SLUG);

export const metadata = createToolPageMetadata({
  slug: SLUG,
  title: "JSON Formatter Online – Free JSON Formatter & Validator",
  description: SEO_DESCRIPTION,
  keywords: [
    "json formatter",
    "json formatter online",
    "json beautifier",
    "json validator",
    "json minifier",
    "format json online",
    "pretty print json",
    "validate json",
  ],
});

export default function JsonFormatterPage() {
  if (!tool || tool.status !== "available") {
    notFound();
  }

  return (
    <>
      <JsonLd data={buildToolPageJsonLd({ slug: SLUG, description: SEO_DESCRIPTION })} />
      <ToolLayout tool={tool}>
        <JsonFormatter />

        <ToolPageFooter
          slug={tool.slug}
          aboutId="json-formatter-about"
          aboutTitle="Format JSON online, privately"
          faq={
            <ToolFaq
              id="json-formatter-faq"
              items={[
                {
                  question: "Can I format JSON with comments?",
                  answer:
                    "No. Comments and trailing commas are not valid standard JSON, so parsing fails. Remove them, then format again.",
                },
                {
                  question: "Does the formatter upload my JSON?",
                  answer:
                    "No. Formatting, minifying, and validation run in your browser. The JSON you paste is not uploaded for processing.",
                },
                {
                  question: "What is the difference between formatting and minifying JSON?",
                  answer:
                    "Formatting pretty prints JSON with two-space indentation so it is easier to read. Minifying removes that whitespace and keeps the same values. Both need valid JSON.",
                },
              ]}
            />
          }
        >
          <ToolAboutParagraph>
            Use this JSON formatter online to pretty print JSON with two-space indentation, minify a payload, or
            validate JSON syntax. Pretty printing lays the same data out so it is easier to read—useful for API
            responses, <code>package.json</code>, and copied logs. Minifying strips whitespace for a shorter copy.
            Validation checks the text and, when it parses, shows that readable preview.
          </ToolAboutParagraph>
          <ToolAboutParagraph>
            The tool accepts strict JSON only. Comments and trailing commas are rejected, and a parse error includes a
            line, column, and a short snippet near the break. You can format JSON in the browser: it uses{" "}
            <code>JSON.parse</code> on your machine and is not uploaded. Copy the result or download it as a{" "}
            <code>.json</code> file.
          </ToolAboutParagraph>
        </ToolPageFooter>
      </ToolLayout>
    </>
  );
}
