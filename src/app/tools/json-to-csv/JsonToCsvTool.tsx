"use client";

import { useCallback } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { DownloadButton } from "@/components/tool-ui/DownloadButton";
import { DualPaneToolWorkspace } from "@/components/tool-ui/DualPaneToolWorkspace";
import { ToolPrivacyAlert } from "@/components/tool-ui/ToolPrivacyAlert";
import { useDualPaneTool } from "@/components/tool-ui/use-dual-pane-tool";
import { jsonToCsv } from "@/lib/csv/json-to-csv";
import { JSON_ARRAY_EXAMPLE } from "@/lib/examples/tool-examples";
import { trackToolAction } from "@/lib/analytics/product-analytics";

const TOOL_SLUG = "json-to-csv";

export function JsonToCsvTool() {
  const tool = useDualPaneTool();

  const handleConvert = useCallback(() => {
    const result = jsonToCsv(tool.input);
    if (result.ok) {
      trackToolAction(TOOL_SLUG, "convert");
      tool.applySuccess(result.output, `Exported ${result.rowCount} row${result.rowCount === 1 ? "" : "s"} to CSV.`);
      return;
    }
    tool.applyError("Could not convert JSON", result.error);
  }, [tool]);

  const handleLoadExample = useCallback(() => {
    tool.onInputChange(JSON_ARRAY_EXAMPLE);
  }, [tool]);

  return (
    <DualPaneToolWorkspace
      inputId="json-to-csv-input"
      outputId="json-to-csv-output"
      inputLabel="JSON array input"
      outputLabel="CSV output"
      input={tool.input}
      onInputChange={tool.onInputChange}
      output={tool.output}
      inputPlaceholder={JSON_ARRAY_EXAMPLE}
      outputPlaceholder="CSV with a header row will appear here."
      hasInputError={Boolean(tool.error)}
      successMessage={tool.successMessage}
      errorTitle={tool.error?.title}
      errorMessage={tool.error?.message}
      errorDetails={tool.error?.details}
      notices={<ToolPrivacyAlert message="Your JSON is processed locally and never uploaded." />}
      toolbar={
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
          <Button type="button" variant="contained" onClick={handleConvert} disabled={!tool.hasInput}>
            Convert to CSV
          </Button>
          <Button type="button" onClick={handleLoadExample}>
            Load example
          </Button>
          <Button type="button" onClick={tool.clearAll} disabled={!tool.hasInput && !tool.hasOutput}>
            Clear
          </Button>
          <CopyButton value={tool.output} analyticsTool={TOOL_SLUG} />
          <DownloadButton value={tool.output} filename="data.csv" mimeType="text/csv;charset=utf-8" analyticsTool={TOOL_SLUG} />
        </Stack>
      }
    />
  );
}
