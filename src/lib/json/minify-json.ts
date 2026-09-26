import { formatParseErrorMessage, parseJson } from "@/lib/json/parse-json";

export type MinifyJsonResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

export function minifyJson(input: string): MinifyJsonResult {
  const parsed = parseJson(input);

  if (!parsed.ok) {
    return {
      ok: false,
      error: formatParseErrorMessage(parsed.error, "minify JSON"),
    };
  }

  return { ok: true, output: JSON.stringify(parsed.value) };
}
