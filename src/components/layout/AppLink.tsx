"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import MuiLink, { type LinkProps as MuiLinkProps } from "@mui/material/Link";

type AppLinkProps = {
  href: string;
  children: ReactNode;
  color?: MuiLinkProps["color"];
  underline?: MuiLinkProps["underline"];
};

export function AppLink({ href, children, color = "inherit", underline = "hover" }: AppLinkProps) {
  return (
    <MuiLink component={NextLink} href={href} color={color} underline={underline}>
      {children}
    </MuiLink>
  );
}
