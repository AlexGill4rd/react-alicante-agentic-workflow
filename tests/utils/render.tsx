import { ChakraProvider } from "@chakra-ui/react";
import { render as testingLibraryRender } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

import { LanguageContextProvider } from "@/contexts/language-context";
import { system } from "@/styles/settings/theme";

function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <LanguageContextProvider>{children}</LanguageContextProvider>
    </ChakraProvider>
  );
}

/**
 * Use this instead of @testing-library/react's render: Chakra v3 components
 * throw without a ChakraProvider, and anything using translations needs the
 * language context.
 */
export function render(ui: ReactElement) {
  return testingLibraryRender(ui, { wrapper: Providers });
}

export { screen, waitFor, within } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
