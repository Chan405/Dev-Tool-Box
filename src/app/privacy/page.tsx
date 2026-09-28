import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles your data when you use the site and its browser-based tools.`,
};

export default function PrivacyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, maxWidth: 720 }}>
        Privacy
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 560, lineHeight: 1.6 }}>
        A short summary of how this site works today. It is not a contract or legal policy.
      </Typography>

      <Container disableGutters maxWidth="md" sx={{ mt: 3, px: 0 }}>
        <Typography component="h2" variant="h2" sx={{ fontSize: "1.25rem", mb: 1.5 }}>
          Local-processing tools
        </Typography>
        <ToolAboutParagraph>
          Several {site.name} tools—including the JSON formatter, JSON converters, CSV tools, and JWT decoder—run
          entirely in your browser. The text you enter into those tools is processed on your device to produce output.
          We do not intentionally send that content to our servers for conversion or storage as part of how those tools
          work.
        </ToolAboutParagraph>
        <ToolAboutParagraph>
          Each tool page includes a notice when processing is local. Treat sensitive production secrets with care on any
          website, even when processing stays in the browser.
        </ToolAboutParagraph>

        <Typography component="h2" variant="h2" sx={{ fontSize: "1.25rem", mb: 1.5, mt: 3 }}>
          Visiting the site
        </Typography>
        <ToolAboutParagraph>
          Loading pages still uses normal web delivery: your browser requests HTML, scripts, and assets from hosting
          infrastructure. Like most websites, that can produce routine server or CDN logs (for example, requested URLs,
          timestamps, and technical identifiers such as IP address and browser type). We use this site without requiring
          you to sign in.
        </ToolAboutParagraph>

        <Typography component="h2" variant="h2" sx={{ fontSize: "1.25rem", mb: 1.5, mt: 3 }}>
          Analytics
        </Typography>
        <ToolAboutParagraph>
          Basic usage analytics may be added or enabled separately from the content you paste into local-processing
          tools. If we turn that on, it would be meant to understand traffic and feature use—not to collect the payload
          you enter into browser-based converters. This page will be updated if that changes.
        </ToolAboutParagraph>

        <Typography component="h2" variant="h2" sx={{ fontSize: "1.25rem", mb: 1.5, mt: 3 }}>
          Questions
        </Typography>
        <ToolAboutParagraph>
          If you are unsure whether a specific tool runs locally, check the info notice on that tool’s page before pasting
          confidential data.
        </ToolAboutParagraph>
      </Container>
    </Container>
  );
}
