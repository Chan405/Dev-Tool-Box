import { decodeJwt } from "@/lib/jwt/decode-jwt";

export type JwtExpirationStatus =
  | "valid"
  | "expired"
  | "not-yet-valid"
  | "no-exp"
  | "invalid-exp"
  | "invalid-token";

export type JwtExpirationResult = {
  status: JwtExpirationStatus;
  exp: string | null;
  nbf: string | null;
  iat: string | null;
  secondsRemaining: number | null;
  message: string | null;
};

const MILLISECOND_THRESHOLD = 1e11;

const EMPTY_RESULT = {
  exp: null,
  nbf: null,
  iat: null,
  secondsRemaining: null,
} as const;

type ClaimName = "exp" | "nbf" | "iat";

type ClaimRead = { ok: true; seconds: number | null } | { ok: false; message: string };

function readNumericDate(value: unknown, name: ClaimName): ClaimRead {
  if (value === undefined) {
    return { ok: true, seconds: null };
  }

  if (typeof value === "string") {
    return { ok: false, message: `${name} must be a JSON number of seconds, not a string.` };
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { ok: false, message: `${name} must be a JSON number of seconds.` };
  }

  if (value > MILLISECOND_THRESHOLD) {
    return {
      ok: false,
      message: `${name} looks like milliseconds. JWT NumericDate values are seconds, and this tool does not convert them.`,
    };
  }

  return { ok: true, seconds: value };
}

function toIsoUtc(seconds: number): string {
  return new Date(seconds * 1000).toISOString();
}

function isInvalidClaim(claim: ClaimRead): claim is { ok: false; message: string } {
  return !claim.ok;
}

export function getJwtExpiration(token: string, nowMs: number): JwtExpirationResult {
  const decoded = decodeJwt(token, new Date(nowMs));

  if (!decoded.ok) {
    return {
      status: "invalid-token",
      ...EMPTY_RESULT,
      message: decoded.error,
    };
  }

  const expRead = readNumericDate(decoded.payload.exp, "exp");
  const nbfRead = readNumericDate(decoded.payload.nbf, "nbf");
  const iatRead = readNumericDate(decoded.payload.iat, "iat");
  const failed = [expRead, nbfRead, iatRead].find(isInvalidClaim);

  const expSeconds = expRead.ok ? expRead.seconds : null;
  const nbfSeconds = nbfRead.ok ? nbfRead.seconds : null;
  const iatSeconds = iatRead.ok ? iatRead.seconds : null;
  const nowSeconds = Math.floor(nowMs / 1000);

  const times = {
    exp: expSeconds === null ? null : toIsoUtc(expSeconds),
    nbf: nbfSeconds === null ? null : toIsoUtc(nbfSeconds),
    iat: iatSeconds === null ? null : toIsoUtc(iatSeconds),
  };

  if (failed) {
    return {
      status: "invalid-exp",
      ...times,
      secondsRemaining: null,
      message: failed.message,
    };
  }

  if (expSeconds === null) {
    return {
      status: "no-exp",
      ...times,
      secondsRemaining: null,
      message: "This token has no exp claim, so expiration cannot be determined from the payload.",
    };
  }

  const secondsRemaining = expSeconds - nowSeconds;

  if (nbfSeconds !== null && nowSeconds < nbfSeconds) {
    return {
      status: "not-yet-valid",
      ...times,
      secondsRemaining,
      message: "nbf is still in the future. The signature was not checked.",
    };
  }

  if (nowSeconds >= expSeconds) {
    return {
      status: "expired",
      ...times,
      secondsRemaining,
      message: "exp is in the past. The signature was not checked.",
    };
  }

  return {
    status: "valid",
    ...times,
    secondsRemaining,
    message: "Inside the exp window. The signature was not checked.",
  };
}
