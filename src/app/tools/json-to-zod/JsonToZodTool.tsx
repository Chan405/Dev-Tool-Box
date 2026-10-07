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
import { jsonToZod } from "@/lib/zod/json-to-zod";
import { trackToolAction } from "@/lib/analytics/product-analytics";

type JsonToZodToolProps = {
  example?: string;
  analyticsSlug?: string;
  inputId?: string;
  outputId?: string;
};

export function JsonToZodTool({
  example = JSON_OBJECT_EXAMPLE,
  analyticsSlug = "json-to-zod",
  inputId = "json-to-zod-input",
  outputId = "json-to-zod-output",
}: JsonToZodToolProps) {
  const tool = useDualPaneTool();
  const [rootName, setRootName] = useState("RootSchema");

  const handleConvert = useCallback(() => {
    const result = jsonToZod(tool.input, rootName);
    if (result.ok) {
      trackToolAction(analyticsSlug, "convert");
      tool.applySuccess(result.output, "Zod schema generated successfully.");
      return;
    }
    tool.applyError("Could not generate schema", result.error);
  }, [analyticsSlug, rootName, tool]);

  const handleLoadExample = useCallback(() => {
    tool.onInputChange(example);
  }, [example, tool]);

  return (
    <DualPaneToolWorkspace
      inputId={inputId}
      outputId={outputId}
      inputLabel="JSON input"
      outputLabel="Zod schema output"
      input={tool.input}
      onInputChange={tool.onInputChange}
      output={tool.output}
      inputPlaceholder={example}
      outputPlaceholder="Generated Zod schema code will appear here."
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
              Generate Zod schema
            </Button>
            <Button type="button" onClick={handleLoadExample}>
              Load example
            </Button>
            <Button type="button" onClick={tool.clearAll} disabled={!tool.hasInput && !tool.hasOutput}>
              Clear
            </Button>
            <CopyButton value={tool.output} analyticsTool={analyticsSlug} />
            <DownloadButton
              value={tool.output}
              filename="schema.ts"
              mimeType="text/plain;charset=utf-8"
              analyticsTool={analyticsSlug}
            />
          </Stack>
          <TextField
            label="Root schema name"
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
