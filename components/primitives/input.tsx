import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";

export type InputProps = ChakraInputProps;

export function Input({ css, ...props }: InputProps) {
  return (
    <ChakraInput
      variant="outline"
      css={{
        background: "transparent",
        borderColor: "var(--card-border-hex)",
        color: "var(--text-primary)",
        _placeholder: { color: "var(--text-muted)" },
        _focusVisible: {
          borderColor: "var(--accent-hex)",
          boxShadow: "0 0 0 1px var(--accent-hex)",
        },
        ...css,
      }}
      {...props}
    />
  );
}
