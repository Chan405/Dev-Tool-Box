import TextField from "@mui/material/TextField";
import { codeFieldSx } from "@/components/tool-ui/code-field-sx";

type OutputAreaProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  minRows?: number;
};

export function OutputArea({
  id,
  label,
  value,
  placeholder = "Output will appear here.",
  minRows = 14,
}: OutputAreaProps) {
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      placeholder={placeholder}
      multiline
      minRows={minRows}
      fullWidth
      sx={codeFieldSx}
      slotProps={{
        htmlInput: {
          readOnly: true,
          "aria-readonly": true,
          spellCheck: false,
        },
      }}
    />
  );
}
