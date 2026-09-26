import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { site } from "@/lib/site";
import { getToolBySlug } from "@/lib/tools/registry";
import { JsonFormatter } from "./JsonFormatter";

const tool = getToolBySlug("json-formatter");

const pageTitle = "JSON Formatter, Beautifier & Validator";
const pageDescription =
  "Format, beautify, minify, and validate JSON online in your browser. Free JSON formatter with local processing—nothing is uploaded to a server.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "json formatter",
    "json beautifier",
    "json validator",
    "json minifier",
    "format json online",
    "pretty print json",
    "validate json",
  ],
  openGraph: {
    title: `${pageTitle} · ${site.name}`,
    description: pageDescription,
    type: "website",
  },
};

export default function JsonFormatterPage() {
  if (!tool || tool.status !== "available") {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <JsonFormatter />

      <Box component="section" aria-labelledby="json-formatter-about" sx={{ mt: { xs: 5, md: 6 }, maxWidth: 720 }}>
        <Typography id="json-formatter-about" component="h2" variant="h2" sx={{ mb: 1.5 }}>
          Format JSON online, privately
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
          Use this JSON formatter to pretty-print messy payloads, minify JSON for APIs and config files, or validate
          syntax before you commit or deploy. It works like a JSON beautifier and validator in one place—handy when you
          are debugging API responses, editing <code>package.json</code>, or cleaning up copied logs.
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Everything runs in your browser with the built-in <code>JSON.parse</code> engine, so your data stays on your
          machine. Paste JSON, choose an action, then copy or download the result as a <code>.json</code> file.
        </Typography>
      </Box>

      <RelatedTools currentSlug={tool.slug} />
    </ToolLayout>
  );
}
