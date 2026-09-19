import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

export type ButtonVariant =
  "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends Omit<
  ChakraButtonProps,
  "variant" | "size"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CSS: Record<ButtonVariant, ChakraButtonProps["css"]> = {
  default: {
    background: "var(--accent-hex)",
    color: "var(--background-hex)",
    border: "1px solid var(--accent-hex)",
    _hover: { background: "var(--accent-muted)" },
  },
  destructive: {
    background: "transparent",
    color: "var(--error-hex)",
    border: "1px solid var(--error-hex)",
    _hover: { background: "var(--card-bg)" },
  },
  outline: {
    background: "transparent",
    color: "var(--accent-hex)",
    border: "1px solid var(--accent-hex)",
    _hover: { background: "var(--card-bg)" },
  },
  secondary: {
    background: "var(--card-bg)",
    color: "var(--text-primary)",
    border: "1px solid var(--card-border-hex)",
    _hover: { borderColor: "var(--card-border-hover-hex)" },
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    _hover: { background: "var(--card-bg)", color: "var(--text-primary)" },
  },
  link: {
    background: "transparent",
    color: "var(--accent-hex)",
    border: "none",
    textDecoration: "underline",
    textUnderlineOffset: "4px",
    _hover: { textDecoration: "none" },
  },
};

const SIZE_PROPS: Record<ButtonSize, ChakraButtonProps> = {
  default: { size: "sm", px: "4" },
  sm: { size: "sm", px: "3", fontSize: "xs" },
  lg: { size: "lg", px: "8" },
  icon: { size: "sm", px: "0", w: "9", minW: "9", h: "9" },
};

export function Button({
  variant = "default",
  size = "default",
  css,
  ...props
}: ButtonProps) {
  return (
    <ChakraButton
      {...SIZE_PROPS[size]}
      css={{ ...VARIANT_CSS[variant], ...css }}
      {...props}
    />
  );
}
