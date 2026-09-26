import { notFound } from "next/navigation";
import { getToolBySlug } from "@/lib/tools/registry";
import type { ToolDefinition } from "@/lib/tools/types";

export function requireAvailableTool(slug: string): ToolDefinition {
  const tool = getToolBySlug(slug);

  if (!tool || tool.status !== "available") {
    notFound();
  }

  return tool;
}
