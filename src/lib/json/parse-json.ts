export type JsonParseErrorDetails = {
  message: string;
  position?: number;
  line?: number;
  column?: number;
  snippet?: string;
};

export type JsonParseSuccess = {
  ok: true;
  value: unknown;
  /** Trimmed source string that was parsed. */
  source: string;
};

export type JsonParseFailure = {
  ok: false;
  error: JsonParseErrorDetails;
};

export type JsonParseResult = JsonParseSuccess | JsonParseFailure;

const EMPTY_MESSAGE = "Enter JSON to process.";

function lineColumnAt(source: string, index: number): { line: number; column: number } {
  const before = source.slice(0, index);
  const line = before.split("\n").length;
  const lastNewline = before.lastIndexOf("\n");
  const column = index - lastNewline;
  return { line, column };
}

function snippetAround(source: string, index: number, radius = 24): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(source.length, index + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < source.length ? "…" : "";
  return `${prefix}${source.slice(start, end)}${suffix}`;
}

function syntaxErrorDetails(source: string, error: SyntaxError): JsonParseErrorDetails {
  const message = error.message;
  const positionMatch = message.match(/position\s+(\d+)/i);
  const position = positionMatch ? Number.parseInt(positionMatch[1], 10) : undefined;

  if (position === undefined || Number.isNaN(position)) {
    return { message };
  }

  const safeIndex = Math.min(Math.max(position, 0), source.length);
  const { line, column } = lineColumnAt(source, safeIndex);

  return {
    message,
    position: safeIndex,
    line,
    column,
    snippet: snippetAround(source, safeIndex),
  };
}

function failureFromInput(input: string, source: string, error: unknown): JsonParseFailure {
  const trimStart = input.indexOf(source);
  const base =
    error instanceof SyntaxError
      ? syntaxErrorDetails(source, error)
      : { message: "The value is not valid JSON." };

  if (base.position === undefined || trimStart < 0) {
    return { ok: false, error: base };
  }

  const positionInInput = trimStart + base.position;
  const { line, column } = lineColumnAt(input, positionInInput);

  return {
    ok: false,
    error: {
      ...base,
      position: positionInInput,
      line,
      column,
      snippet: snippetAround(input, positionInInput),
    },
  };
}

export function parseJson(input: string): JsonParseResult {
  const source = input.trim();

  if (!source) {
    return {
      ok: false,
      error: { message: EMPTY_MESSAGE },
    };
  }

  try {
    const value: unknown = JSON.parse(source);
    return { ok: true, value, source };
  } catch (error) {
    return failureFromInput(input, source, error);
  }
}

export function formatParseErrorMessage(error: JsonParseErrorDetails, actionLabel: string): string {
  if (error.message === EMPTY_MESSAGE) {
    return error.message;
  }

  const parts = [`Could not ${actionLabel}.`, error.message];

  if (error.line !== undefined && error.column !== undefined) {
    parts.push(`Line ${error.line}, column ${error.column}.`);
  }

  if (error.snippet) {
    parts.push(`Near: ${error.snippet}`);
  }

  return parts.join(" ");
}
