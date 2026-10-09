"use client";

import { useCallback, useState } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { ToolPrivacyAlert } from "@/components/tool-ui/ToolPrivacyAlert";
import { trackToolAction } from "@/lib/analytics/product-analytics";
import { JWT_EXPIRED_EXAMPLE } from "@/lib/examples/tool-examples";
import { getJwtExpiration, type JwtExpirationResult, type JwtExpirationStatus } from "@/lib/jwt/jwt-expiration";

const TOOL_SLUG = "jwt-expiration-checker";

const STATUS_LABEL: Record<JwtExpirationStatus, string> = {
  valid: "Inside the exp window",
  expired: "Expired",
  "not-yet-valid": "Not yet valid",
  "no-exp": "No exp claim",
  "invalid-exp": "Invalid time claim",
  "invalid-token": "Invalid token",
};

function messageSeverity(status: JwtExpirationStatus): "success" | "error" | "info" | "warning" {
  switch (status) {
    case "valid":
      return "success";
    case "expired":
    case "invalid-exp":
    case "invalid-token":
      return "error";
    case "not-yet-valid":
      return "warning";
    default:
      return "info";
  }
}

function statusChipColor(status: JwtExpirationStatus): "default" | "success" | "warning" | "error" {
  switch (status) {
    case "valid":
      return "success";
    case "expired":
    case "invalid-token":
    case "invalid-exp":
      return "error";
    case "not-yet-valid":
      return "warning";
    default:
      return "default";
  }
}

function formatCount(seconds: number): string {
  const units: readonly [number, string][] = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  const match = units.find(([size]) => seconds >= size) ?? [1, "second"];
  const [size, name] = match;
  const count = Math.max(1, Math.floor(seconds / size));
  return `${count} ${count === 1 ? name : `${name}s`}`;
}

function formatRelative(secondsRemaining: number): string {
  if (secondsRemaining === 0) {
    return "expired just now";
  }
  if (secondsRemaining < 0) {
    return `expired ${formatCount(Math.abs(secondsRemaining))} ago`;
  }
  return `expires in ${formatCount(secondsRemaining)}`;
}

function formatLocal(isoUtc: string): string {
  return new Date(isoUtc).toLocaleString(undefined, { timeZoneName: "short" });
}

export function JwtExpirationTool() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtExpirationResult | null>(null);

  const hasToken = token.trim().length > 0;

  const handleCheck = useCallback(() => {
    const checkedAt = Date.now();
    const next = getJwtExpiration(token, checkedAt);
    trackToolAction(TOOL_SLUG, "check");
    setResult(next);
  }, [token]);

  const handleInputChange = useCallback((value: string) => {
    setToken(value);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setToken("");
    setResult(null);
  }, []);

  const handleLoadExample = useCallback(() => {
    setToken(JWT_EXPIRED_EXAMPLE);
    setResult(null);
  }, []);

  const timeRows = result
    ? (
        [
          { name: "exp", iso: result.exp },
          { name: "nbf", iso: result.nbf },
          { name: "iat", iso: result.iat },
        ] satisfies { name: string; iso: string | null }[]
      ).flatMap((row) => (row.iso === null ? [] : [{ name: row.name, iso: row.iso }]))
    : [];

  return (
    <Stack spacing={2}>
      <ToolPrivacyAlert message="Your JWT is checked locally in your browser and never sent to a server." />
      <Alert severity="warning" icon={<WarningAmberOutlinedIcon fontSize="inherit" />}>
        This checks time claims only. It does not verify the signature, so it cannot tell you the token is genuine.
      </Alert>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Button type="button" variant="contained" onClick={handleCheck} disabled={!hasToken}>
          Check expiration
        </Button>
        <Button type="button" onClick={handleLoadExample}>
          Load example
        </Button>
        <Button type="button" onClick={handleClear} disabled={!hasToken && !result}>
          Clear
        </Button>
      </Stack>

      {result ? (
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
            <Chip label={STATUS_LABEL[result.status]} color={statusChipColor(result.status)} variant="outlined" />
            {result.secondsRemaining !== null ? (
              <Typography variant="body2" color="text.secondary">
                {formatRelative(result.secondsRemaining)}
              </Typography>
            ) : null}
          </Stack>
          {result.message ? <Alert severity={messageSeverity(result.status)}>{result.message}</Alert> : null}
        </Stack>
      ) : null}

      <CodeEditor
        id="jwt-expiration-input"
        label="JWT"
        value={token}
        onChange={handleInputChange}
        placeholder={JWT_EXPIRED_EXAMPLE}
        error={result?.status === "invalid-token" || result?.status === "invalid-exp"}
        minRows={4}
      />

      {timeRows.length > 0 ? (
        <Box sx={{ overflowX: "auto" }}>
          <Typography component="h2" variant="h2" sx={{ mb: 1.5, fontSize: "1.15rem" }}>
            Time claims
          </Typography>
          <Table size="small" aria-label="JWT expiration claims">
            <TableHead>
              <TableRow>
                <TableCell>Claim</TableCell>
                <TableCell>UTC</TableCell>
                <TableCell>Local</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "var(--font-geist-mono), monospace" }}>{row.iso}</TableCell>
                  <TableCell>{formatLocal(row.iso)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : null}
    </Stack>
  );
}
