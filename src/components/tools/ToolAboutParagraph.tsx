import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";

export function ToolAboutParagraph({ children }: { children: ReactNode }) {
  return (
    <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 1.5 }}>
      {children}
    </Typography>
  );
}
