import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { getRelatedTools, getToolBySlug } from "@/lib/tools/registry";

type RelatedToolsProps = {
  currentSlug: string;
};

export function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const current = getToolBySlug(currentSlug);
  if (!current) {
    return null;
  }

  const related = getRelatedTools(current);
  if (related.length === 0) {
    return null;
  }

  return (
    <Box component="section" aria-labelledby="related-tools-heading" sx={{ mt: { xs: 5, md: 6 } }}>
      <Typography id="related-tools-heading" component="h2" variant="h2" sx={{ mb: 2 }}>
        Related tools
      </Typography>
      <ToolGrid tools={related} />
    </Box>
  );
}
