"use client";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ToolIcon } from "@/components/icons/ToolIcon";
import type { CategoryDefinition, ToolCategory } from "@/lib/tools/types";

type ToolCategoriesProps = {
  categories: readonly CategoryDefinition[];
  counts: Readonly<Record<ToolCategory, number>>;
  selected: ToolCategory | null;
  onSelect: (category: ToolCategory) => void;
};

export function ToolCategories({ categories, counts, selected, onSelect }: ToolCategoriesProps) {
  return (
    <Box
      role="group"
      aria-label="Filter by category"
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(5, minmax(0, 1fr))",
        },
      }}
    >
      {categories.map((category) => {
        const isSelected = selected === category.id;
        const count = counts[category.id];

        return (
          <Button
            key={category.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(category.id)}
            sx={(theme) => ({
              height: "100%",
              width: "100%",
              px: 2,
              py: 1.75,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              textAlign: "left",
              textTransform: "none",
              whiteSpace: "normal",
              color: "text.primary",
              border: 1,
              borderColor: isSelected ? "primary.main" : "divider",
              bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : "background.paper",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              },
            })}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.main" }}>
              <ToolIcon name={category.icon} />
              <Typography component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                {category.label}
              </Typography>
            </Box>
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{ display: "block", mt: 0.75, fontWeight: 400, lineHeight: 1.45 }}
            >
              {category.description}
            </Typography>
            <Typography component="span" variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.25 }}>
              {count} {count === 1 ? "tool" : "tools"}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );
}
