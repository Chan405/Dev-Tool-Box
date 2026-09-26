import { formatParseErrorMessage, parseJson } from "@/lib/json/parse-json";

export type FormatJsonResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

export function formatJson(input: string): FormatJsonResult {
  const parsed = parseJson(input);

  if (!parsed.ok) {
    return {
      ok: false,
      error: formatParseErrorMessage(parsed.error, "format JSON"),
    };
  }

  return { ok: true, output: JSON.stringify(parsed.value, null, 2) };
}
