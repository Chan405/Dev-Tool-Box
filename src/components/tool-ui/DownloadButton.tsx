"use client";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";

type DownloadButtonProps = {
  value: string;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
};

export function DownloadButton({
  value,
  filename,
  mimeType = "text/plain;charset=utf-8",
  disabled = false,
}: DownloadButtonProps) {
  const isDisabled = disabled || value.length === 0;

  function handleDownload() {
    if (isDisabled) {
      return;
    }

    const blob = new Blob([value], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <Button
      type="button"
      variant="outlined"
      startIcon={<FileDownloadIcon />}
      onClick={handleDownload}
      disabled={isDisabled}
    >
      Download
    </Button>
  );
}
