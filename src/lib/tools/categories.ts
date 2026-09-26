import type { CategoryDefinition, ToolCategory } from "@/lib/tools/types";

export const categories: readonly CategoryDefinition[] = [
  {
    id: "json",
    label: "JSON",
    description: "Format and reshape JSON.",
    icon: "data-object",
  },
  {
    id: "data",
    label: "Data",
    description: "Convert and inspect common data formats.",
    icon: "table",
  },
  {
    id: "api",
    label: "API",
    description: "Reference material for working with APIs.",
    icon: "http",
  },
  {
    id: "security",
    label: "Security",
    description: "Decode tokens and inspect security-related values.",
    icon: "key",
  },
  {
    id: "ai",
    label: "AI",
    description: "Helpers for prompts and model workflows.",
    icon: "auto-awesome",
  },
];

export function getCategory(id: ToolCategory): CategoryDefinition {
  const category = categories.find((item) => item.id === id);

  if (!category) {
    throw new Error(`Unknown tool category: ${id}`);
  }

  return category;
}
