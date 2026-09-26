import type { ReactNode } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppLink } from "@/components/layout/AppLink";
import { getCategory } from "@/lib/tools/categories";
import type { ToolDefinition } from "@/lib/tools/types";

export function ToolLayout({ tool, children }: { tool: ToolDefinition; children: ReactNode }) {
  const category = getCategory(tool.category);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 2 }}>
        <AppLink href="/tools">Tools</AppLink>
        <Typography color="text.primary" aria-current="page">
          {tool.name}
        </Typography>
      </Breadcrumbs>
      <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 1.5, flexWrap: "wrap" }}>
        <Chip size="small" label={category.label} variant="outlined" />
        {tool.status === "coming-soon" ? <Chip size="small" label="Coming soon" variant="outlined" /> : null}
      </Stack>
      <Typography component="h1" variant="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, maxWidth: 760 }}>
        {tool.name}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, maxWidth: 720, lineHeight: 1.6 }}>
        {tool.description}
      </Typography>
      {children}
    </Container>
  );
}
