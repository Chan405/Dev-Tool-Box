import type { Metadata } from "next";
import Container from "@mui/material/Container";
import { ToolBrowser } from "@/components/tools/ToolBrowser";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — ${site.tagline}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
      <ToolBrowser variant="home" />
    </Container>
  );
}
