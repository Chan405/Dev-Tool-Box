import { parseJson, formatParseErrorMessage } from "@/lib/json/parse-json";

export type JsonToCsvResult =
  | { ok: true; output: string; rowCount: number }
  | { ok: false; error: string };

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toCellString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function jsonToCsv(input: string): JsonToCsvResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return { ok: false, error: formatParseErrorMessage(parsed.error, "convert JSON to CSV") };
  }

  const { value } = parsed;

  if (!Array.isArray(value)) {
    return {
      ok: false,
      error: "JSON must be an array of objects. Example: [{\"name\":\"Alice\",\"age\":25}].",
    };
  }

  if (value.length === 0) {
    return { ok: false, error: "The JSON array is empty. Add at least one object row." };
  }

  if (!value.every(isPlainObject)) {
    return {
      ok: false,
      error: "Every item in the array must be a JSON object with consistent keys.",
    };
  }

  const headers: string[] = [];
  const headerSet = new Set<string>();

  for (const row of value) {
    for (const key of Object.keys(row)) {
      if (!headerSet.has(key)) {
        headerSet.add(key);
        headers.push(key);
      }
    }
  }

  if (headers.length === 0) {
    return { ok: false, error: "Objects in the array do not contain any properties to export." };
  }

  const lines = [headers.map(escapeCsvCell).join(",")];

  for (const row of value) {
    const cells = headers.map((header) => escapeCsvCell(toCellString(row[header])));
    lines.push(cells.join(","));
  }

  return {
    ok: true,
    output: lines.join("\n"),
    rowCount: value.length,
  };
}
