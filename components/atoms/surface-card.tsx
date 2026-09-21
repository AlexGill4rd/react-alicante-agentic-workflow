import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface SurfaceCardProps {
  children: ReactNode;
}

export function SurfaceCard({ children }: SurfaceCardProps) {
  return (
    <Box
      height="full"
      overflow="hidden"
      padding="1.5"
      borderRadius="md"
      borderWidth="1px"
      borderColor="var(--card-border-hex)"
      background="var(--card-bg)"
      fontSize="xs"
      lineHeight="tight"
      transition="border-color 0.2s"
      _hover={{ borderColor: "var(--card-border-hover-hex)" }}
    >
      {children}
    </Box>
  );
}
