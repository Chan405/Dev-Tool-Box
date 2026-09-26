import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e4b15a",
      contrastText: "#1a1408",
    },
    background: {
      default: "#101318",
      paper: "#171c24",
    },
    text: {
      primary: "#e7edf4",
      secondary: "#a8b0bd",
    },
    divider: "rgba(231, 237, 244, 0.12)",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    h1: {
      fontSize: "2.75rem",
      lineHeight: 1.15,
      fontWeight: 600,
      letterSpacing: "-0.035em",
    },
    h2: {
      fontSize: "1.25rem",
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "1.05rem",
      lineHeight: 1.4,
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "var(--font-geist-sans), sans-serif",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});
