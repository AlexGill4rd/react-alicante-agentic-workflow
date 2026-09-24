"use client";

import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface InteractiveSurfaceProps {
  children: ReactNode;
  variant?: "default" | "compact";
  height?: string;
}

export function InteractiveSurface({
  children,
  variant = "default",
  height,
}: InteractiveSurfaceProps) {
  const padding = variant === "compact" ? "3" : "6";

  return (
    <Box
      position="relative"
      height={height ?? (variant === "compact" ? "full" : undefined)}
      padding={padding}
      borderRadius={
        variant === "compact" ? "var(--radius-xl)" : "var(--radius-xl)"
      }
      background="var(--card-fill)"
      boxShadow="var(--shadow-card)"
      fontSize={variant === "compact" ? "xs" : undefined}
      lineHeight={variant === "compact" ? "tight" : undefined}
      transition="box-shadow var(--transition-standard), transform var(--transition-standard)"
      _hover={{
        boxShadow: "var(--shadow-card-hover)",
        transform: variant === "compact" ? undefined : "scale(1.02)",
      }}
    >
      {children}
    </Box>
  );
}
