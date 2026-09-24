"use client";

import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";

export interface InteractiveSurfaceProps {
  children: ReactNode;
  /** Tighter padding for timeline blocks. */
  variant?: "default" | "compact";
  height?: string;
}

export function InteractiveSurface({
  children,
  variant = "default",
  height,
}: InteractiveSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, visible: false });

  const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, visible: true });
  }, []);

  const onMouseLeave = useCallback(() => {
    setSpotlight((previous) => ({ ...previous, visible: false }));
  }, []);

  const padding = variant === "compact" ? "1.5" : "6";

  return (
    <Box
      ref={ref}
      position="relative"
      height={height ?? (variant === "compact" ? "full" : undefined)}
      overflow="hidden"
      padding={padding}
      borderRadius="var(--radius-2xl)"
      borderWidth="1px"
      borderColor="var(--card-border-hex)"
      backgroundColor="var(--card-fill)"
      backgroundImage="var(--card-bg)"
      boxShadow="var(--shadow-card)"
      fontSize={variant === "compact" ? "xs" : undefined}
      lineHeight={variant === "compact" ? "tight" : undefined}
      transition={`border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      _hover={{
        borderColor: "var(--card-border-hover-hex)",
        boxShadow: "var(--shadow-card-hover)",
        transform: variant === "compact" ? undefined : "translateY(-2px)",
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
        pointerEvents: "none",
      }}
      _after={{
        content: '""',
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        pointerEvents: "none",
        opacity: spotlight.visible ? 1 : 0,
        transition: "opacity var(--transition-standard)",
        background: `radial-gradient(300px circle at ${spotlight.x}% ${spotlight.y}%, rgba(94,106,210,0.15), transparent 60%)`,
      }}
    >
      <Box position="relative" zIndex="1">
        {children}
      </Box>
    </Box>
  );
}
