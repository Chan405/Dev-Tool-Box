"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const toolsActive = pathname === "/tools" || pathname.startsWith("/tools/");

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "rgba(16, 19, 24, 0.86)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Box
        component={NextLink}
        href="#main"
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
          "&:focus": {
            position: "fixed",
            left: 16,
            top: 16,
            zIndex: 2000,
            width: "auto",
            height: "auto",
            margin: 0,
            overflow: "visible",
            clip: "auto",
            px: 1.5,
            py: 1,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: 1,
            fontWeight: 600,
            textDecoration: "none",
          },
        }}
      >
        Skip to content
      </Box>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64, gap: 2 }}>
          <Box
            component={NextLink}
            href="/"
            aria-label={`${site.name} home`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              color: "inherit",
              textDecoration: "none",
              minWidth: 0,
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              DT
            </Box>
            <Typography component="span" sx={{ fontWeight: 700, letterSpacing: "-0.03em", fontSize: "1.05rem" }}>
              {site.name}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            component={NextLink}
            href="/tools"
            color={toolsActive ? "primary" : "inherit"}
            aria-current={toolsActive ? "page" : undefined}
            sx={{ minHeight: 44 }}
          >
            Tools
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
