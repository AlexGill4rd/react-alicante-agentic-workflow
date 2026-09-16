import { chakra, type HTMLChakraProps } from "@chakra-ui/react";

export type LabelProps = HTMLChakraProps<"label">;

const ChakraLabel = chakra("label");

export function Label(props: LabelProps) {
  return (
    <ChakraLabel
      fontSize="sm"
      fontWeight="medium"
      lineHeight="1"
      css={{ color: "var(--text-primary)" }}
      {...props}
    />
  );
}
