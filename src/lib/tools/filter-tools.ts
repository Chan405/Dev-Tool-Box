import { getCategory } from "@/lib/tools/categories";
import type { ToolCategory, ToolDefinition } from "@/lib/tools/types";

export function filterTools(
  source: readonly ToolDefinition[],
  query: string,
  categoryId: ToolCategory | null,
): ToolDefinition[] {
  const normalized = query.trim().toLowerCase();

  return source.filter((tool) => {
    if (categoryId && tool.category !== categoryId) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    const category = getCategory(tool.category);
    const haystack = [
      tool.name,
      tool.description,
      tool.slug,
      category.label,
      category.description,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
