"use client";

import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { CopyButton } from "@/components/tool-ui/CopyButton";
import { DownloadButton } from "@/components/tool-ui/DownloadButton";
import { DualPaneToolWorkspace } from "@/components/tool-ui/DualPaneToolWorkspace";
import { ToolPrivacyAlert } from "@/components/tool-ui/ToolPrivacyAlert";
import { useDualPaneTool } from "@/components/tool-ui/use-dual-pane-tool";
import { JSON_OBJECT_EXAMPLE } from "@/lib/examples/tool-examples";
import { jsonToTypescript } from "@/lib/typescript/json-to-typescript";
import { trackToolAction } from "@/lib/analytics/product-analytics";

const TOOL_SLUG = "json-to-typescript";

export function JsonToTypescriptTool() {
  const tool = useDualPaneTool();
  const [rootName, setRootName] = useState("Root");

  const handleConvert = useCallback(() => {
    const result = jsonToTypescript(tool.input, rootName);
    if (result.ok) {
      trackToolAction(TOOL_SLUG, "convert");
      tool.applySuccess(result.output, "TypeScript types generated successfully.");
      return;
    }
    tool.applyError("Could not generate types", result.error);
  }, [rootName, tool]);

  const handleLoadExample = useCallback(() => {
    tool.onInputChange(JSON_OBJECT_EXAMPLE);
  }, [tool]);

  return (
    <DualPaneToolWorkspace
      inputId="json-to-ts-input"
      outputId="json-to-ts-output"
      inputLabel="JSON input"
      outputLabel="TypeScript output"
      input={tool.input}
      onInputChange={tool.onInputChange}
      output={tool.output}
      inputPlaceholder={JSON_OBJECT_EXAMPLE}
      outputPlaceholder="Generated interfaces and types will appear here."
      hasInputError={Boolean(tool.error)}
      successMessage={tool.successMessage}
      errorTitle={tool.error?.title}
      errorMessage={tool.error?.message}
      errorDetails={tool.error?.details}
      notices={<ToolPrivacyAlert message="Your JSON is processed locally and never uploaded." />}
      toolbar={
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
            <Button type="button" variant="contained" onClick={handleConvert} disabled={!tool.hasInput}>
              Generate TypeScript
            </Button>
            <Button type="button" onClick={handleLoadExample}>
              Load example
            </Button>
            <Button type="button" onClick={tool.clearAll} disabled={!tool.hasInput && !tool.hasOutput}>
              Clear
            </Button>
            <CopyButton value={tool.output} analyticsTool={TOOL_SLUG} />
            <DownloadButton value={tool.output} filename="types.ts" mimeType="text/plain;charset=utf-8" analyticsTool={TOOL_SLUG} />
          </Stack>
          <TextField
            label="Root type name"
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            size="small"
            sx={{ maxWidth: 280 }}
            slotProps={{ htmlInput: { spellCheck: false } }}
          />
        </Stack>
      }
    />
  );
}
