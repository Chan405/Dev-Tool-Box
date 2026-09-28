"use client";

import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { DownloadButton } from "@/components/tool-ui/DownloadButton";
import { DualPaneToolWorkspace } from "@/components/tool-ui/DualPaneToolWorkspace";
import { ToolPrivacyAlert } from "@/components/tool-ui/ToolPrivacyAlert";
import { useDualPaneTool } from "@/components/tool-ui/use-dual-pane-tool";
import { csvToJson } from "@/lib/csv/parse-csv-to-json";
import { CSV_EXAMPLE } from "@/lib/examples/tool-examples";
import { trackToolAction } from "@/lib/analytics/product-analytics";

const TOOL_SLUG = "csv-to-json";

export function CsvToJsonTool() {
  const tool = useDualPaneTool();
  const [useHeaders, setUseHeaders] = useState(true);

  const handleConvert = useCallback(() => {
    const result = csvToJson(tool.input, { useFirstRowAsHeaders: useHeaders });
    if (result.ok) {
      trackToolAction(TOOL_SLUG, "convert");
      tool.applySuccess(result.output, `Converted ${result.rowCount} row${result.rowCount === 1 ? "" : "s"} to JSON.`);
      return;
    }
    tool.applyError("Could not convert CSV", result.error);
  }, [tool, useHeaders]);

  const handleLoadExample = useCallback(() => {
    tool.onInputChange(CSV_EXAMPLE);
  }, [tool]);

  return (
    <DualPaneToolWorkspace
      inputId="csv-to-json-input"
      outputId="csv-to-json-output"
      inputLabel="CSV input"
      outputLabel="JSON output"
      input={tool.input}
      onInputChange={tool.onInputChange}
      output={tool.output}
      inputPlaceholder={CSV_EXAMPLE}
      outputPlaceholder="Pretty-printed JSON will appear here after conversion."
      hasInputError={Boolean(tool.error)}
      successMessage={tool.successMessage}
      errorTitle={tool.error?.title}
      errorMessage={tool.error?.message}
      notices={<ToolPrivacyAlert message="Your CSV is processed locally and never uploaded." />}
      toolbar={
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
            <Button type="button" variant="contained" onClick={handleConvert} disabled={!tool.hasInput}>
              Convert to JSON
            </Button>
            <Button type="button" onClick={handleLoadExample}>
              Load example
            </Button>
            <Button type="button" onClick={tool.clearAll} disabled={!tool.hasInput && !tool.hasOutput}>
              Clear
            </Button>
            <CopyButton value={tool.output} analyticsTool={TOOL_SLUG} />
            <DownloadButton
              value={tool.output}
              filename="data.json"
              mimeType="application/json;charset=utf-8"
              analyticsTool={TOOL_SLUG}
            />
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={useHeaders}
                onChange={(event) => setUseHeaders(event.target.checked)}
              />
            }
            label="First row is headers"
          />
        </Stack>
      }
    />
  );
}
