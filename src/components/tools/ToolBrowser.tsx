"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ToolCategories } from "@/components/tools/ToolCategories";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { ToolSearch } from "@/components/tools/ToolSearch";
import { categories } from "@/lib/tools/categories";
import { filterTools } from "@/lib/tools/filter-tools";
import { tools } from "@/lib/tools/registry";
import { site } from "@/lib/site";
import type { ToolCategory } from "@/lib/tools/types";

type ToolBrowserProps = {
  variant: "home" | "catalog";
};

export function ToolBrowser({ variant }: ToolBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | null>(null);
  const filtered = filterTools(tools, query, selectedCategory);
  const hasFilters = query.trim().length > 0 || selectedCategory !== null;

  const counts = categories.reduce(
    (accumulator, category) => {
      accumulator[category.id] = filterTools(tools, query, category.id).length;
      return accumulator;
    },
    {} as Record<ToolCategory, number>,
  );

  function clearFilters() {
    setQuery("");
    setSelectedCategory(null);
  }

  function selectCategory(category: ToolCategory) {
    setSelectedCategory((current) => (current === category ? null : category));
  }

  const toolsHeading = variant === "home" ? "Tools" : "All tools";
  const toolsHeadingId = variant === "home" ? "home-tools-heading" : "catalog-tools-heading";

  return (
    <>
      {variant === "home" ? (
        <Box component="section" aria-labelledby="hero-heading" sx={{ pt: { xs: 5, md: 9 }, pb: { xs: 4, md: 6 } }}>
          <Typography
            id="hero-heading"
            component="h1"
            variant="h1"
            sx={{ maxWidth: 820, fontSize: { xs: "2.35rem", sm: "3rem", md: "3.7rem" } }}
          >
            {site.tagline}
          </Typography>
          <Typography
            sx={{
              mt: 2.5,
              maxWidth: 560,
              color: "text.secondary",
              fontSize: { xs: "1.05rem", md: "1.125rem" },
              lineHeight: 1.6,
            }}
          >
            {site.description}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <ToolSearch value={query} onChange={setQuery} />
          </Box>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <ToolSearch id="catalog-tool-search" value={query} onChange={setQuery} />
        </Box>
      )}

      <Box component="section" aria-labelledby="categories-heading" sx={{ pb: { xs: 4, md: 5 } }}>
        <Typography id="categories-heading" component="h2" variant="h2" sx={{ mb: 2 }}>
          Categories
        </Typography>
        <ToolCategories
          categories={categories}
          counts={counts}
          selected={selectedCategory}
          onSelect={selectCategory}
        />
      </Box>

      <Box component="section" aria-labelledby={toolsHeadingId} sx={{ pb: { xs: 2, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { sm: "baseline" }, justifyContent: "space-between", mb: 2 }}
        >
          <Typography id={toolsHeadingId} component="h2" variant="h2">
            {toolsHeading}
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Typography component="p" color="text.secondary" aria-live="polite">
              {filtered.length === 1 ? "1 tool" : `${filtered.length} tools`}
            </Typography>
            {hasFilters && filtered.length > 0 ? (
              <Button type="button" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null}
          </Stack>
        </Stack>
        {filtered.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography color="text.secondary">No tools match your search.</Typography>
            <Button type="button" onClick={clearFilters} sx={{ mt: 2 }}>
              Clear filters
            </Button>
          </Box>
        ) : (
          <ToolGrid tools={filtered} />
        )}
      </Box>
    </>
  );
}
