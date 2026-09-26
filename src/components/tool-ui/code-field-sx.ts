import type { SxProps, Theme } from "@mui/material/styles";

export const codeFieldSx: SxProps<Theme> = {
  "& .MuiInputBase-input": {
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
    fontSize: "0.875rem",
    lineHeight: 1.6,
  },
};
