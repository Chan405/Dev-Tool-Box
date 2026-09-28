"use client";

import { useEffect, useRef, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import visuallyHidden from "@mui/utils/visuallyHidden";
import { trackCopyOutput } from "@/lib/analytics/product-analytics";

type CopyButtonProps = {
  value: string;
  disabled?: boolean;
  /** Registry slug for privacy-safe copy analytics (metadata only). */
  analyticsTool?: string;
};

export function CopyButton({ value, disabled = false, analyticsTool }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timeoutRef = useRef<number | null>(null);
  const isDisabled = disabled || value.length === 0;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (isDisabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
      if (analyticsTool) {
        trackCopyOutput(analyticsTool);
      }
    } catch {
      setStatus("failed");
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => setStatus("idle"), 2000);
  }

  const label = status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy";
  const announcement =
    status === "copied" ? "Copied to clipboard." : status === "failed" ? "Could not copy to the clipboard." : "";

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopy}
        disabled={isDisabled}
      >
        {label}
      </Button>
      <Box component="span" role="status" sx={visuallyHidden}>
        {announcement}
      </Box>
    </>
  );
}
