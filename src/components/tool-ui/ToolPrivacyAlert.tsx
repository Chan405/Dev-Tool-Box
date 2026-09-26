import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";

type ToolPrivacyAlertProps = {
  id?: string;
  message?: string;
};

export function ToolPrivacyAlert({
  id = "tool-privacy-notice",
  message = "Your data is processed locally in your browser and never uploaded.",
}: ToolPrivacyAlertProps) {
  return (
    <Alert id={id} severity="info" icon={<LockOutlinedIcon fontSize="inherit" />}>
      {message}
    </Alert>
  );
}
