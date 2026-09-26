"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { OutputArea } from "@/components/tool-ui/OutputArea";
import { JsonErrorAlert } from "@/components/tool-ui/JsonErrorAlert";
import type { JsonParseErrorDetails } from "@/lib/json/parse-json";

type DualPaneToolWorkspaceProps = {
  inputId: string;
  outputId: string;
  inputLabel: string;
  outputLabel: string;
  input: string;
  onInputChange: (value: string) => void;
  output: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  toolbar: ReactNode;
  inputDescribedBy?: string;
  hasInputError?: boolean;
  successMessage?: string | null;
  errorTitle?: string | null;
  errorMessage?: string | null;
  errorDetails?: JsonParseErrorDetails;
  notices?: ReactNode;
  minRows?: number;
};

export function DualPaneToolWorkspace({
  inputId,
  outputId,
  inputLabel,
  outputLabel,
  input,
  onInputChange,
  output,
  inputPlaceholder,
  outputPlaceholder,
  toolbar,
  inputDescribedBy,
  hasInputError = false,
  successMessage,
  errorTitle,
  errorMessage,
  errorDetails,
  notices,
  minRows = 16,
}: DualPaneToolWorkspaceProps) {
  return (
    <Stack spacing={2}>
      {notices}
      {toolbar}
      {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
      {errorMessage ? (
        <JsonErrorAlert
          id="tool-error"
          title={errorTitle ?? "Error"}
          message={errorMessage}
          details={errorDetails}
        />
      ) : null}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          alignItems: "stretch",
        }}
      >
        <CodeEditor
          id={inputId}
          label={inputLabel}
          value={input}
          onChange={onInputChange}
          placeholder={inputPlaceholder}
          error={hasInputError}
          describedBy={inputDescribedBy}
          minRows={minRows}
        />
        <OutputArea
          id={outputId}
          label={outputLabel}
          value={output}
          placeholder={outputPlaceholder}
          minRows={minRows}
        />
      </Box>
    </Stack>
  );
}
