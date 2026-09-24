import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "style" | "className" | "color"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const TRANSITION =
  "background var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)";

const VARIANT_CSS: Record<ButtonVariant, ChakraButtonProps["css"]> = {
  default: {
    background: "var(--accent-hex)",
    color: "#ffffff",
    border: "1px solid transparent",
    boxShadow: "var(--shadow-button-accent)",
    transition: TRANSITION,
    _hover: {
      background: "var(--accent-muted)",
      boxShadow:
        "0 0 0 1px rgba(94, 106, 210, 0.6), 0 6px 20px rgba(94, 106, 210, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
    },
    _active: { transform: "scale(0.98)" },
  },
  destructive: {
    background: "transparent",
    color: "var(--error-hex)",
    border: "1px solid var(--error-hex)",
    transition: TRANSITION,
    _hover: { background: "var(--surface)" },
    _active: { transform: "scale(0.98)" },
  },
  outline: {
    background: "transparent",
    color: "var(--accent-hex)",
    border: "1px solid var(--card-border-accent)",
    transition: TRANSITION,
    _hover: { background: "var(--surface)" },
    _active: { transform: "scale(0.98)" },
  },
  secondary: {
    background: "var(--surface)",
    color: "var(--text-primary)",
    border: "1px solid var(--card-border-hex)",
    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.06)",
    transition: TRANSITION,
    _hover: {
      background: "var(--surface-hover)",
      borderColor: "var(--card-border-hover-hex)",
    },
    _active: { transform: "scale(0.98)" },
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    transition: TRANSITION,
    _hover: {
      background: "var(--surface)",
      color: "var(--text-primary)",
    },
    _active: { transform: "scale(0.98)" },
  },
  link: {
    background: "transparent",
    color: "var(--accent-hex)",
    border: "none",
    textDecoration: "underline",
    textUnderlineOffset: "4px",
    transition: TRANSITION,
    _hover: { textDecoration: "none", color: "var(--accent-muted)" },
  },
};

const SIZE_PROPS: Record<ButtonSize, ChakraButtonProps> = {
  default: { size: "sm", px: "4", borderRadius: "var(--radius-lg)" },
  sm: { size: "sm", px: "3", fontSize: "xs", borderRadius: "var(--radius-lg)" },
  lg: { size: "lg", px: "8", borderRadius: "var(--radius-lg)" },
  icon: {
    size: "sm",
    px: "0",
    w: "9",
    minW: "9",
    h: "9",
    borderRadius: "var(--radius-lg)",
  },
};

export function Button({
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ChakraButton {...SIZE_PROPS[size]} css={VARIANT_CSS[variant]} {...props} />
  );
}
