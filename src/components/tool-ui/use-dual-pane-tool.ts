"use client";

import { useCallback, useState } from "react";
import type { JsonParseErrorDetails } from "@/lib/json/parse-json";

type ToolErrorState = {
  title: string;
  message: string;
  details?: JsonParseErrorDetails;
};

export function useDualPaneTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<ToolErrorState | null>(null);

  const hasInput = input.trim().length > 0;
  const hasOutput = output.length > 0;

  const resetFeedback = useCallback(() => {
    setOutput("");
    setSuccessMessage(null);
    setError(null);
  }, []);

  const onInputChange = useCallback(
    (value: string) => {
      setInput(value);
      resetFeedback();
    },
    [resetFeedback],
  );

  const applySuccess = useCallback((nextOutput: string, message: string) => {
    setOutput(nextOutput);
    setSuccessMessage(message);
    setError(null);
  }, []);

  const applyError = useCallback((title: string, message: string, details?: JsonParseErrorDetails) => {
    setOutput("");
    setSuccessMessage(null);
    setError({ title, message, details });
  }, []);

  const clearAll = useCallback(() => {
    setInput("");
    resetFeedback();
  }, [resetFeedback]);

  return {
    input,
    output,
    successMessage,
    error,
    hasInput,
    hasOutput,
    onInputChange,
    applySuccess,
    applyError,
    clearAll,
    resetFeedback,
  };
}
