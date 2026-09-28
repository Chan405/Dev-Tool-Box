import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { AppLink } from "@/components/layout/AppLink";
import { ToolAboutParagraph } from "@/components/tools/ToolAboutParagraph";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `What ${site.name} is and how it helps with everyday developer utilities.`,
};

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" }, maxWidth: 720 }}>
        About {site.name}
      </Typography>

      <Container disableGutters maxWidth="md" sx={{ mt: 3, px: 0 }}>
        <ToolAboutParagraph>
          {site.name} is a collection of fast, focused utilities for formatting, inspecting, and transforming the kind
          of data developers work with every day—JSON, CSV, tokens, and similar payloads.
        </ToolAboutParagraph>
        <ToolAboutParagraph>
          The goal is to keep common tools simple and accessible: open a page, paste or type your input, and get a
          result without setup or an account. When a tool is marked as running locally, processing happens in your
          browser rather than on our servers.
        </ToolAboutParagraph>
        <ToolAboutParagraph>
          Browse the <AppLink href="/tools">tools catalog</AppLink> to see what is available today, or read our{" "}
          <AppLink href="/privacy">Privacy</AppLink> page for how the site handles data.
        </ToolAboutParagraph>
      </Container>
    </Container>
  );
}
