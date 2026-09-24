import {
  Badge as ChakraBadge,
  type BadgeProps as ChakraBadgeProps,
} from "@chakra-ui/react";
import type { HTMLAttributes } from "react";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "style" | "className" | "color"
> {
  variant?: BadgeVariant;
}

const VARIANT_CSS: Record<BadgeVariant, ChakraBadgeProps["css"]> = {
  default: {
    background: "var(--accent-hex)",
    color: "#ffffff",
    borderColor: "transparent",
    boxShadow: "0 0 12px var(--accent-glow-soft)",
  },
  secondary: {
    background: "var(--surface)",
    color: "var(--text-secondary)",
    borderColor: "var(--card-border-hex)",
  },
  destructive: {
    background: "transparent",
    color: "var(--error-hex)",
    borderColor: "var(--error-hex)",
  },
  outline: {
    background: "transparent",
    color: "var(--text-primary)",
    borderColor: "var(--card-border-accent)",
  },
};

export function Badge({ variant = "default", ...props }: BadgeProps) {
  return (
    <ChakraBadge
      variant="outline"
      borderWidth="1px"
      borderRadius="full"
      fontSize="xs"
      fontWeight="medium"
      letterSpacing="0.02em"
      px="2.5"
      py="0.5"
      css={VARIANT_CSS[variant]}
      {...props}
    />
  );
}
