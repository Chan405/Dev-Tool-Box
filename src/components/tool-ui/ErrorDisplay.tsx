import Alert from "@mui/material/Alert";

type ErrorDisplayProps = {
  id?: string;
  message: string | null;
};

export function ErrorDisplay({ id, message }: ErrorDisplayProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert id={id} severity="error">
      {message}
    </Alert>
  );
}
