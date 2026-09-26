"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CodeEditor } from "@/components/tool-ui/CodeEditor";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { DownloadButton } from "@/components/tool-ui/DownloadButton";
import { JsonErrorAlert } from "@/components/tool-ui/JsonErrorAlert";
import { OutputArea } from "@/components/tool-ui/OutputArea";
import { EXAMPLE_JSON } from "@/lib/json/example-json";
import { formatJson } from "@/lib/json/format-json";
import { minifyJson } from "@/lib/json/minify-json";
import type { JsonParseErrorDetails } from "@/lib/json/parse-json";
import { validateJson } from "@/lib/json/validate-json";

type JsonAction = "format" | "minify" | "validate";

type FeedbackState = {
  output: string;
  lastAction: JsonAction | null;
  successMessage: string | null;
  errorTitle: string | null;
  errorMessage: string | null;
  errorDetails: JsonParseErrorDetails | undefined;
};

const initialFeedback: FeedbackState = {
  output: "",
  lastAction: null,
  successMessage: null,
  errorTitle: null,
  errorMessage: null,
  errorDetails: undefined,
};

const OUTPUT_PLACEHOLDER =
  "Formatted or minified JSON will appear here after you run an action. Validation also shows a readable preview when your JSON is valid.";

function downloadFilename(action: JsonAction | null): string {
  if (action === "minify") {
    return "minified.json";
  }
  return "formatted.json";
}

function outputLabel(action: JsonAction | null): string {
  if (action === "minify") {
    return "Minified JSON";
  }
  if (action === "validate") {
    return "Validated JSON preview";
  }
  return "Formatted JSON";
}

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(initialFeedback);

  const hasInput = input.trim().length > 0;
  const hasOutput = feedback.output.length > 0;
  const hasError = feedback.errorMessage !== null;

  const clearFeedback = useCallback(() => {
    setFeedback(initialFeedback);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setFeedback(initialFeedback);
  }, []);

  const applyFailure = useCallback((title: string, message: string, details?: JsonParseErrorDetails) => {
    setFeedback({
      output: "",
      lastAction: null,
      successMessage: null,
      errorTitle: title,
      errorMessage: message,
      errorDetails: details,
    });
  }, []);

  const applySuccess = useCallback((action: JsonAction, output: string, successMessage: string) => {
    setFeedback({
      output,
      lastAction: action,
      successMessage,
      errorTitle: null,
      errorMessage: null,
      errorDetails: undefined,
    });
  }, []);

  const handleFormat = useCallback(() => {
    const result = formatJson(input);
    if (result.ok) {
      applySuccess("format", result.output, "JSON formatted successfully.");
      return;
    }
    applyFailure("Invalid JSON", result.error);
  }, [applyFailure, applySuccess, input]);

  const handleMinify = useCallback(() => {
    const result = minifyJson(input);
    if (result.ok) {
      applySuccess("minify", result.output, "JSON minified successfully.");
      return;
    }
    applyFailure("Invalid JSON", result.error);
  }, [applyFailure, applySuccess, input]);

  const handleValidate = useCallback(() => {
    const result = validateJson(input);
    if (result.ok) {
      applySuccess("validate", result.output, "Valid JSON. Syntax checks passed.");
      return;
    }
    applyFailure("Invalid JSON", result.error, result.details);
  }, [applyFailure, applySuccess, input]);

  const handleClear = useCallback(() => {
    setInput("");
    clearFeedback();
  }, [clearFeedback]);

  const handleLoadExample = useCallback(() => {
    setInput(EXAMPLE_JSON);
    clearFeedback();
  }, [clearFeedback]);

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && hasInput) {
        event.preventDefault();
        handleFormat();
      }
    },
    [handleFormat, hasInput],
  );

  const describedByIds = [
    "json-privacy-notice",
    hasError ? "json-format-error" : null,
    feedback.successMessage ? "json-format-success" : null,
    "json-keyboard-hint",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Stack spacing={2}>
      <Alert id="json-privacy-notice" severity="info" icon={<LockOutlinedIcon fontSize="inherit" />}>
        Your JSON is processed locally and never uploaded.
      </Alert>

      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Button type="button" variant="contained" onClick={handleFormat} disabled={!hasInput}>
          Format / Pretty print
        </Button>
        <Button type="button" variant="outlined" onClick={handleMinify} disabled={!hasInput}>
          Minify
        </Button>
        <Button type="button" variant="outlined" onClick={handleValidate} disabled={!hasInput}>
          Validate
        </Button>
        <Button type="button" onClick={handleLoadExample}>
          Load example
        </Button>
        <Button type="button" onClick={handleClear} disabled={!hasInput && !hasOutput}>
          Clear
        </Button>
        <CopyButton value={feedback.output} />
        <DownloadButton
          value={feedback.output}
          filename={downloadFilename(feedback.lastAction)}
          mimeType="application/json;charset=utf-8"
        />
      </Stack>

      <Typography id="json-keyboard-hint" variant="caption" color="text.secondary" component="p" sx={{ m: 0 }}>
        Tip: press Ctrl+Enter (or ⌘+Enter on Mac) in the input area to format.
      </Typography>

      {feedback.successMessage ? (
        <Alert id="json-format-success" severity="success">
          {feedback.successMessage}
        </Alert>
      ) : null}

      {feedback.errorMessage ? (
        <JsonErrorAlert
          id="json-format-error"
          title={feedback.errorTitle ?? "Error"}
          message={feedback.errorMessage}
          details={feedback.errorDetails}
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
          id="json-input"
          label="JSON input"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={EXAMPLE_JSON}
          error={hasError}
          describedBy={describedByIds || undefined}
          minRows={16}
        />
        <OutputArea
          id="json-output"
          label={outputLabel(feedback.lastAction)}
          value={feedback.output}
          placeholder={OUTPUT_PLACEHOLDER}
          minRows={16}
        />
      </Box>
    </Stack>
  );
}
