import Papa from "papaparse";

export type CsvToJsonResult =
  | { ok: true; output: string; rowCount: number }
  | { ok: false; error: string };

export type CsvToJsonOptions = {
  useFirstRowAsHeaders: boolean;
};

function formatParseError(errors: Papa.ParseError[]): string {
  const first = errors[0];
  const location =
    first.row !== undefined
      ? ` (row ${first.row + 1}${first.index !== undefined ? `, column ${first.index + 1}` : ""})`
      : "";
  return `Could not parse CSV${location}: ${first.message}`;
}

export function csvToJson(input: string, options: CsvToJsonOptions): CsvToJsonResult {
  const source = input.trim();

  if (!source) {
    return { ok: false, error: "Enter CSV text to convert." };
  }

  if (options.useFirstRowAsHeaders) {
    const parsed = Papa.parse<Record<string, string>>(source, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      return { ok: false, error: formatParseError(parsed.errors) };
    }

    if (parsed.data.length === 0) {
      return { ok: false, error: "No CSV rows were found." };
    }

    const normalized = parsed.data.map((row) => {
      const record: Record<string, string | null> = {};
      for (const [key, value] of Object.entries(row)) {
        record[key] = value === "" ? null : value;
      }
      return record;
    });

    return {
      ok: true,
      output: JSON.stringify(normalized, null, 2),
      rowCount: normalized.length,
    };
  }

  const parsed = Papa.parse<string[]>(source, {
    header: false,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    return { ok: false, error: formatParseError(parsed.errors) };
  }

  if (parsed.data.length === 0) {
    return { ok: false, error: "No CSV rows were found." };
  }

  const rows = parsed.data.map((row) => row.map((cell) => (cell === "" ? null : cell)));

  return {
    ok: true,
    output: JSON.stringify(rows, null, 2),
    rowCount: rows.length,
  };
}
