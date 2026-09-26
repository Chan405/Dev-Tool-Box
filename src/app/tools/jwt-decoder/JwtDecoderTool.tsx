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
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { OutputArea } from "@/components/tool-ui/OutputArea";
import { ToolPrivacyAlert } from "@/components/tool-ui/ToolPrivacyAlert";
import { JWT_EXAMPLE } from "@/lib/examples/tool-examples";
import { decodeJwt, type JwtDecodeSuccess, type JwtTimeStatus } from "@/lib/jwt/decode-jwt";

function statusChipColor(status: JwtTimeStatus): "default" | "success" | "warning" | "error" {
  switch (status) {
    case "active":
      return "success";
    case "expired":
      return "error";
    case "not-yet-valid":
      return "warning";
    default:
      return "default";
  }
}

export function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<JwtDecodeSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasToken = token.trim().length > 0;

  const handleDecode = useCallback(() => {
    const result = decodeJwt(token);
    if (result.ok) {
      setDecoded(result);
      setError(null);
      return;
    }
    setDecoded(null);
    setError(result.error);
  }, [token]);

  const handleInputChange = useCallback((value: string) => {
    setToken(value);
    setDecoded(null);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setToken("");
    setDecoded(null);
    setError(null);
  }, []);

  const handleLoadExample = useCallback(() => {
    setToken(JWT_EXAMPLE);
    setDecoded(null);
    setError(null);
  }, []);

  return (
    <Stack spacing={2}>
      <ToolPrivacyAlert message="Your JWT is decoded locally in your browser and never sent to a server." />
      <Alert severity="warning" icon={<WarningAmberOutlinedIcon fontSize="inherit" />}>
        Decoding a JWT does not verify its signature or authenticity. Anyone can create a token with arbitrary claims.
        Never trust decoded data for authorization decisions.
      </Alert>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Button type="button" variant="contained" onClick={handleDecode} disabled={!hasToken}>
          Decode JWT
        </Button>
        <Button type="button" onClick={handleLoadExample}>
          Load example
        </Button>
        <Button type="button" onClick={handleClear} disabled={!hasToken && !decoded}>
          Clear
        </Button>
        <CopyButton value={decoded?.payloadJson ?? ""} disabled={!decoded} />
      </Stack>

      {decoded ? (
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <Chip
            label={decoded.timeStatusLabel}
            color={statusChipColor(decoded.timeStatus)}
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            Signature not verified — time status uses payload claims only.
          </Typography>
        </Stack>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      <CodeEditor
        id="jwt-input"
        label="JWT"
        value={token}
        onChange={handleInputChange}
        placeholder={JWT_EXAMPLE}
        error={Boolean(error)}
        minRows={4}
      />

      {decoded && decoded.claims.length > 0 ? (
        <Box>
          <Typography component="h2" variant="h2" sx={{ mb: 1.5, fontSize: "1.15rem" }}>
            Standard claims
          </Typography>
          <Table size="small" aria-label="JWT standard claims">
            <TableHead>
              <TableRow>
                <TableCell>Claim</TableCell>
                <TableCell>Raw value</TableCell>
                <TableCell>Readable</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decoded.claims.map((claim) => (
                <TableRow key={claim.name}>
                  <TableCell component="th" scope="row">{claim.name}</TableCell>
                  <TableCell sx={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                    {typeof claim.raw === "string" ? claim.raw : JSON.stringify(claim.raw)}
                  </TableCell>
                  <TableCell>{claim.formatted ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        }}
      >
        <OutputArea
          id="jwt-header-output"
          label="Header"
          value={decoded?.headerJson ?? ""}
          placeholder="Decoded header JSON will appear here."
          minRows={10}
        />
        <OutputArea
          id="jwt-payload-output"
          label="Payload"
          value={decoded?.payloadJson ?? ""}
          placeholder="Decoded payload JSON will appear here."
          minRows={10}
        />
      </Box>
    </Stack>
  );
}
