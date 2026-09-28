"use client";

import { track } from "@vercel/analytics";

const SAFE_TOKEN = /^[a-z0-9-]+$/;

function isSafeToken(value: string): boolean {
  return value.length > 0 && value.length <= 64 && SAFE_TOKEN.test(value);
}

/** Generic tool use (slug + action only — never user content). */
export function trackToolAction(tool: string, action: string): void {
  if (!isSafeToken(tool) || !isSafeToken(action)) {
    return;
  }

  track("tool_action", { tool, action });
}

export function trackCopyOutput(tool: string): void {
  if (!isSafeToken(tool)) {
    return;
  }

  track("copy_output", { tool });
}

export function trackDownloadOutput(tool: string): void {
  if (!isSafeToken(tool)) {
    return;
  }

  track("download_output", { tool });
}
