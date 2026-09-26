"use client";

import type { KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";
import { codeFieldSx } from "@/components/tool-ui/code-field-sx";

type CodeEditorProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  describedBy?: string;
  minRows?: number;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export function CodeEditor({
  id,
  label,
  value,
  onChange,
  placeholder,
  error = false,
  describedBy,
  minRows = 14,
  onKeyDown,
}: CodeEditorProps) {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      error={error}
      multiline
      minRows={minRows}
      fullWidth
      sx={codeFieldSx}
      slotProps={{
        htmlInput: {
          spellCheck: false,
          autoCapitalize: "off",
          autoCorrect: "off",
          "aria-describedby": describedBy,
        },
      }}
    />
  );
}
