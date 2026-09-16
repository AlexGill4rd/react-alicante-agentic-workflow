"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { system } from "@/styles/settings/theme"
import { LanguageContextProvider } from "@/contexts/language-context"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"

export function Provider({ children, ...props }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider
        attribute="data-theme"
        defaultTheme="dark"
        enableSystem={false}
        {...props}
      >
        <LanguageContextProvider>{children}</LanguageContextProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
