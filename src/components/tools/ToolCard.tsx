"use client";

import NextLink from "next/link";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ToolIcon } from "@/components/icons/ToolIcon";
import { getCategory } from "@/lib/tools/categories";
import { getToolHref } from "@/lib/tools/registry";
import type { ToolDefinition } from "@/lib/tools/types";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const category = getCategory(tool.category);
  const href = getToolHref(tool);
  const available = href !== null;

  const body = (
    <>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
        <Box
          sx={(theme) => ({
            width: 36,
            height: 36,
            borderRadius: 1,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
          })}
        >
          <ToolIcon name={tool.icon} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {category.label}
        </Typography>
      </Stack>
      <Typography component="h3" variant="h3">
        {tool.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, flex: 1 }}>
        {tool.description}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Chip
          size="small"
          variant="outlined"
          label={available ? "Available" : "Coming soon"}
          color={available ? "primary" : "default"}
        />
      </Box>
    </>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderColor: "divider",
        ...(available && {
          transition: "border-color 160ms ease",
          "&:hover, &:focus-within": {
            borderColor: "primary.main",
          },
        }),
      }}
    >
      {href ? (
        <CardActionArea
          component={NextLink}
          href={href}
          sx={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            whiteSpace: "normal",
            textAlign: "left",
            p: 2.5,
          }}
        >
          {body}
        </CardActionArea>
      ) : (
        <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1, p: 2.5, "&:last-child": { pb: 2.5 } }}>
          {body}
        </CardContent>
      )}
    </Card>
  );
}
