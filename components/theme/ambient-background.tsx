"use client";

import { Box } from "@chakra-ui/react";

const BLOB_BASE = {
  position: "absolute",
  borderRadius: "full",
  pointerEvents: "none",
  filter: "blur(120px)",
} as const;

/** Fixed ambient layers behind page content (blobs, grid, noise). */
export function AmbientBackground() {
  return (
    <Box
      aria-hidden
      position="fixed"
      inset="0"
      zIndex="0"
      overflow="hidden"
      pointerEvents="none"
    >
      <Box
        {...BLOB_BASE}
        top="-20%"
        left="50%"
        width="900px"
        height="1400px"
        marginLeft="-450px"
        background="var(--accent-glow)"
        opacity="0.25"
        animation="ambient-float 10s ease-in-out infinite"
      />
      <Box
        {...BLOB_BASE}
        top="30%"
        left="-10%"
        width="600px"
        height="800px"
        background="linear-gradient(135deg, rgba(94,106,210,0.2), rgba(168,85,247,0.12))"
        opacity="0.15"
        animation="ambient-float-slow 12s ease-in-out infinite"
      />
      <Box
        {...BLOB_BASE}
        top="20%"
        right="-5%"
        width="500px"
        height="700px"
        background="linear-gradient(225deg, rgba(94,106,210,0.18), rgba(59,130,246,0.1))"
        opacity="0.12"
        animation="ambient-float 9s ease-in-out infinite reverse"
      />
      <Box
        {...BLOB_BASE}
        bottom="0"
        left="30%"
        width="700px"
        height="400px"
        filter="blur(100px)"
        background="var(--accent-hex)"
        opacity="0.1"
        animation="ambient-pulse 8s ease-in-out infinite"
      />
      <Box
        position="absolute"
        inset="0"
        opacity="0.02"
        backgroundImage="
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        "
        backgroundSize="64px 64px"
      />
    </Box>
  );
}
