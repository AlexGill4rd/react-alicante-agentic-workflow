"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/styles/settings/theme";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider
        attribute="data-theme"
        defaultTheme="light"
        enableSystem={false}
        {...props}
      >
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
