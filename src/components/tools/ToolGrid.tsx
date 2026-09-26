import Box from "@mui/material/Box";
import type { ToolDefinition } from "@/lib/tools/types";
import { ToolCard } from "@/components/tools/ToolCard";

export function ToolGrid({ tools }: { tools: readonly ToolDefinition[] }) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <Box
      component="ul"
      sx={{
        display: "grid",
        listStyle: "none",
        p: 0,
        m: 0,
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(3, minmax(0, 1fr))",
        },
      }}
    >
      {tools.map((tool) => (
        <Box component="li" key={tool.slug} sx={{ display: "flex", minWidth: 0 }}>
          <ToolCard tool={tool} />
        </Box>
      ))}
    </Box>
  );
}
