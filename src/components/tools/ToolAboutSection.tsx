import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type ToolAboutSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function ToolAboutSection({ id, title, children }: ToolAboutSectionProps) {
  return (
    <Box component="section" aria-labelledby={id} sx={{ mt: { xs: 5, md: 6 }, maxWidth: 720 }}>
      <Typography id={id} component="h2" variant="h2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
