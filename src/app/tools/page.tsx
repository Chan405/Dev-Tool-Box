import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ToolBrowser } from "@/components/tools/ToolBrowser";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tools",
  description: `Browse ${site.name} utilities for JSON, data, APIs, security, and AI.`,
};

export default function ToolsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "2.25rem", md: "2.75rem" } }}>
        Tools
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 560, lineHeight: 1.6 }}>
        Browse every utility. Search by name or keyword, or filter by category.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <ToolBrowser variant="catalog" />
      </Box>
    </Container>
  );
}
