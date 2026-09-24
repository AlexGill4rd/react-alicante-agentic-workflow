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

const TRANSITION = "all var(--transition-standard) var(--ease-md)";
const PILL = "var(--radius-pill)";

const VARIANT_CSS: Record<ButtonVariant, ChakraButtonProps["css"]> = {
  default: {
    background: "var(--md-primary)",
    color: "var(--md-on-primary)",
    border: "none",
    borderRadius: PILL,
    fontWeight: "500",
    transition: TRANSITION,
    _hover: { background: "var(--md-primary-hover)" },
    _active: {
      background: "var(--md-primary-pressed)",
      transform: "scale(0.95)",
    },
    _focusVisible: {
      outline: "2px solid var(--md-primary)",
      outlineOffset: "2px",
    },
  },
  secondary: {
    background: "var(--md-secondary-container)",
    color: "var(--md-on-secondary-container)",
    border: "none",
    borderRadius: PILL,
    fontWeight: "500",
    transition: TRANSITION,
    _hover: { filter: "brightness(0.97)" },
    _active: { transform: "scale(0.95)" },
  },
  outline: {
    background: "transparent",
    color: "var(--md-primary)",
    border: "1px solid var(--md-outline)",
    borderRadius: PILL,
    fontWeight: "500",
    transition: TRANSITION,
    _hover: { background: "var(--surface)" },
    _active: { transform: "scale(0.95)" },
  },
  ghost: {
    background: "transparent",
    color: "var(--md-primary)",
    border: "none",
    borderRadius: PILL,
    fontWeight: "500",
    transition: TRANSITION,
    _hover: { background: "var(--surface)" },
    _active: { transform: "scale(0.95)" },
  },
  destructive: {
    background: "transparent",
    color: "var(--error-hex)",
    border: "1px solid var(--error-hex)",
    borderRadius: PILL,
    transition: TRANSITION,
    _active: { transform: "scale(0.95)" },
  },
  link: {
    background: "transparent",
    color: "var(--md-primary)",
    border: "none",
    borderRadius: PILL,
    textDecoration: "underline",
    textUnderlineOffset: "4px",
    _hover: { textDecoration: "none" },
  },
};

const SIZE_PROPS: Record<ButtonSize, ChakraButtonProps> = {
  default: { height: "10", px: "6", fontSize: "sm" },
  sm: { height: "9", px: "4", fontSize: "xs" },
  lg: { height: "12", px: "8", fontSize: "md" },
  icon: { height: "10", width: "10", minW: "10", px: "0" },
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
