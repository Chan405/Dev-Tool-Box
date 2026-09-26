import { formatParseErrorMessage, parseJson, type JsonParseErrorDetails } from "@/lib/json/parse-json";

export type ValidateJsonResult =
  | { ok: true; output: string }
  | { ok: false; error: string; details: JsonParseErrorDetails };

export function validateJson(input: string): ValidateJsonResult {
  const parsed = parseJson(input);

  if (!parsed.ok) {
    return {
      ok: false,
      error: formatParseErrorMessage(parsed.error, "validate JSON"),
      details: parsed.error,
    };
  }

  return {
    ok: true,
    output: JSON.stringify(parsed.value, null, 2),
  };
}
