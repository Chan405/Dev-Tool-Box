import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { JsonParseErrorDetails } from "@/lib/json/parse-json";

type JsonErrorAlertProps = {
  id?: string;
  title: string;
  message: string;
  details?: JsonParseErrorDetails;
};

export function JsonErrorAlert({ id, title, message, details }: JsonErrorAlertProps) {
  const showDetails =
    details &&
    details.message !== "Enter JSON to process." &&
    (details.line !== undefined || details.snippet !== undefined);

  return (
    <Alert id={id} severity="error">
      <AlertTitle>{title}</AlertTitle>
      <Typography variant="body2" component="p" sx={{ m: 0 }}>
        {message}
      </Typography>
      {showDetails ? (
        <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5 }}>
          {details.line !== undefined && details.column !== undefined ? (
            <Typography component="li" variant="body2">
              Line {details.line}, column {details.column}
            </Typography>
          ) : null}
          {details.snippet ? (
            <Typography
              component="li"
              variant="body2"
              sx={{
                mt: 0.5,
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                wordBreak: "break-all",
              }}
            >
              {details.snippet}
            </Typography>
          ) : null}
        </Box>
      ) : null}
    </Alert>
  );
}
