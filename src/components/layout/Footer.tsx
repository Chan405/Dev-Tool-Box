import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppLink } from "@/components/layout/AppLink";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: { xs: 3, sm: 4 } }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "space-between",
          alignItems: { sm: "center" },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 {site.name}. Utilities for everyday development work.
        </Typography>
        <Stack component="nav" aria-label="Footer" direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
          <AppLink href="/" color="text.secondary">
            Home
          </AppLink>
          <AppLink href="/tools" color="text.secondary">
            Tools
          </AppLink>
          <AppLink href="/about" color="text.secondary">
            About
          </AppLink>
          <AppLink href="/privacy" color="text.secondary">
            Privacy
          </AppLink>
        </Stack>
      </Container>
    </Box>
  );
}
