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
    background: "var(--md-primary)",
    color: "var(--md-on-primary)",
    borderColor: "transparent",
  },
  secondary: {
    background: "var(--md-secondary-container)",
    color: "var(--md-on-secondary-container)",
    borderColor: "transparent",
  },
  destructive: {
    background: "transparent",
    color: "var(--error-hex)",
    borderColor: "var(--error-hex)",
  },
  outline: {
    background: "var(--md-secondary-container)",
    color: "var(--md-on-secondary-container)",
    borderColor: "transparent",
  },
};

export function Badge({ variant = "default", ...props }: BadgeProps) {
  return (
    <ChakraBadge
      variant="outline"
      borderWidth="0"
      borderRadius="var(--radius-pill)"
      fontSize="xs"
      fontWeight="500"
      px="3"
      py="1"
      css={VARIANT_CSS[variant]}
      {...props}
    />
  );
}
