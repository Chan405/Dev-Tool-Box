export type JwtTimeStatus = "expired" | "not-yet-valid" | "active" | "unknown";

export type JwtClaimInsight = {
  name: string;
  raw: unknown;
  formatted?: string;
};

export type JwtDecodeSuccess = {
  ok: true;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  headerJson: string;
  payloadJson: string;
  timeStatus: JwtTimeStatus;
  timeStatusLabel: string;
  claims: JwtClaimInsight[];
};

export type JwtDecodeFailure = {
  ok: false;
  error: string;
};

export type JwtDecodeResult = JwtDecodeSuccess | JwtDecodeFailure;

const TIME_CLAIMS = new Set(["exp", "iat", "nbf"]);

function decodeBase64Url(segment: string): string {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding === 0 ? normalized : normalized + "=".repeat(4 - padding);

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parseJsonSegment(segment: string, label: string): Record<string, unknown> {
  try {
    const decoded = decodeBase64Url(segment);
    const value: unknown = JSON.parse(decoded);
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error(`${label} must be a JSON object.`);
    }
    return value as Record<string, unknown>;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Invalid segment.";
    throw new Error(`Could not decode JWT ${label.toLowerCase()}: ${detail}`);
  }
}

function toUnixSeconds(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function formatUnixSeconds(seconds: number): string {
  return new Date(seconds * 1000).toLocaleString();
}

function evaluateTimeStatus(payload: Record<string, unknown>, nowSeconds: number): {
  status: JwtTimeStatus;
  label: string;
} {
  const nbf = toUnixSeconds(payload.nbf);
  const exp = toUnixSeconds(payload.exp);

  if (nbf !== null && nowSeconds < nbf) {
    return { status: "not-yet-valid", label: "Not yet valid (nbf is in the future)." };
  }

  if (exp !== null) {
    if (nowSeconds >= exp) {
      return { status: "expired", label: "Expired (exp is in the past)." };
    }
    return { status: "active", label: "Not expired (based on exp only; signature not verified)." };
  }

  return {
    status: "unknown",
    label: "No exp claim — time validity cannot be determined from the payload alone.",
  };
}

function buildClaimInsights(payload: Record<string, unknown>): JwtClaimInsight[] {
  const priority = ["exp", "iat", "nbf", "iss", "sub", "aud"];
  const insights: JwtClaimInsight[] = [];

  for (const name of priority) {
    if (!(name in payload)) {
      continue;
    }
    const raw = payload[name];
    const insight: JwtClaimInsight = { name, raw };

    if (TIME_CLAIMS.has(name)) {
      const seconds = toUnixSeconds(raw);
      if (seconds !== null) {
        insight.formatted = formatUnixSeconds(seconds);
      }
    } else if (name === "aud" && Array.isArray(raw)) {
      insight.formatted = raw.map(String).join(", ");
    } else if (typeof raw === "string") {
      insight.formatted = raw;
    }

    insights.push(insight);
  }

  return insights;
}

export function decodeJwt(token: string, now = new Date()): JwtDecodeResult {
  const trimmed = token.trim();

  if (!trimmed) {
    return { ok: false, error: "Paste a JWT to decode." };
  }

  const parts = trimmed.split(".");

  if (parts.length !== 3) {
    return {
      ok: false,
      error: "A JWT must contain three Base64URL-encoded segments separated by dots (header.payload.signature).",
    };
  }

  if (parts.some((part) => part.length === 0)) {
    return { ok: false, error: "One or more JWT segments are empty." };
  }

  try {
    const header = parseJsonSegment(parts[0], "Header");
    const payload = parseJsonSegment(parts[1], "Payload");
    const nowSeconds = Math.floor(now.getTime() / 1000);
    const { status, label } = evaluateTimeStatus(payload, nowSeconds);

    return {
      ok: true,
      header,
      payload,
      headerJson: JSON.stringify(header, null, 2),
      payloadJson: JSON.stringify(payload, null, 2),
      timeStatus: status,
      timeStatusLabel: label,
      claims: buildClaimInsights(payload),
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "The token could not be decoded.";
    return { ok: false, error: detail };
  }
}
