"use client";

import { Box } from "@chakra-ui/react";

/** MD3 organic tonal shapes behind page content. */
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
        position="absolute"
        top="-10%"
        right="-15%"
        width="520px"
        height="520px"
        borderRadius="full"
        background="var(--md-secondary-container)"
        opacity="0.85"
        filter="blur(80px)"
        animation="md-float 10s ease-in-out infinite"
      />
      <Box
        position="absolute"
        top="35%"
        left="-20%"
        width="480px"
        height="320px"
        borderRadius="100px"
        borderTopRightRadius="20px"
        background="var(--md-primary)"
        opacity="0.18"
        filter="blur(72px)"
        animation="md-float 12s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        bottom="5%"
        right="10%"
        width="360px"
        height="360px"
        borderRadius="full"
        background="var(--md-tertiary)"
        opacity="0.15"
        filter="blur(64px)"
      />
    </Box>
  );
}
