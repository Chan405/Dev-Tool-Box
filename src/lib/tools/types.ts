export const toolCategories = ["json", "data", "api", "security", "ai"] as const;

export type ToolCategory = (typeof toolCategories)[number];

export type ToolStatus = "available" | "coming-soon";

export const toolIconNames = [
  "data-object",
  "compress",
  "code",
  "table",
  "http",
  "key",
  "auto-awesome",
] as const;

export type ToolIconName = (typeof toolIconNames)[number];

export type ToolDefinition = {
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  keywords: readonly string[];
  icon: ToolIconName;
  status: ToolStatus;
};

export type CategoryDefinition = {
  id: ToolCategory;
  label: string;
  description: string;
  icon: ToolIconName;
};
