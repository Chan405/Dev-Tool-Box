import type { ToolDefinition } from "@/lib/tools/types";

/** Add a tool here, then create `src/app/tools/<slug>/page.tsx` when it is available. */
export const tools: readonly ToolDefinition[] = [
  {
    name: "JSON Formatter",
    slug: "json-formatter",
    description: "Pretty-print JSON locally in your browser. Nothing is uploaded.",
    category: "json",
    keywords: [
      "json",
      "format",
      "formatter",
      "beautifier",
      "pretty",
      "pretty print",
      "minify",
      "validator",
      "stringify",
      "validate",
      "parse",
      "online",
    ],
    icon: "data-object",
    status: "available",
  },
  {
    name: "JSON Minifier",
    slug: "json-minifier",
    description: "Remove whitespace from JSON without changing its structure.",
    category: "json",
    keywords: ["json", "minify", "compress", "compact"],
    icon: "compress",
    status: "coming-soon",
  },
  {
    name: "Base64 Encode / Decode",
    slug: "base64",
    description: "Encode text to Base64 and decode it back.",
    category: "data",
    keywords: ["base64", "encode", "decode", "ascii"],
    icon: "code",
    status: "coming-soon",
  },
  {
    name: "CSV to JSON",
    slug: "csv-to-json",
    description: "Turn CSV rows into JSON for quick inspection.",
    category: "data",
    keywords: ["csv", "json", "convert", "table", "spreadsheet"],
    icon: "table",
    status: "coming-soon",
  },
  {
    name: "HTTP Status Codes",
    slug: "http-status-codes",
    description: "Look up what an HTTP status code means.",
    category: "api",
    keywords: ["http", "status", "codes", "api", "rest"],
    icon: "http",
    status: "coming-soon",
  },
  {
    name: "JWT Decoder",
    slug: "jwt-decoder",
    description: "Decode a JSON Web Token header and payload.",
    category: "security",
    keywords: ["jwt", "token", "decode", "security", "auth"],
    icon: "key",
    status: "coming-soon",
  },
  {
    name: "Token Counter",
    slug: "token-counter",
    description: "Estimate how many tokens a piece of text will use.",
    category: "ai",
    keywords: ["ai", "tokens", "prompt", "llm", "count"],
    icon: "auto-awesome",
    status: "coming-soon",
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolHref(tool: ToolDefinition): string | null {
  if (tool.status !== "available") {
    return null;
  }

  return `/tools/${tool.slug}`;
}

/** Same-category tools first, then the rest of the catalog (excluding the current tool). */
export function getRelatedTools(current: ToolDefinition, limit = 6): ToolDefinition[] {
  const others = tools.filter((tool) => tool.slug !== current.slug);
  const sameCategory = others.filter((tool) => tool.category === current.category);
  const otherCategories = others.filter((tool) => tool.category !== current.category);

  return [...sameCategory, ...otherCategories].slice(0, limit);
}
