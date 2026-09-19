import { ChakraProvider } from "@chakra-ui/react";
import { render as testingLibraryRender } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";

import messages from "@/messages/en.json";
import { routing } from "@/i18n/routing";
import { system } from "@/styles/settings/theme";

function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <NextIntlClientProvider
        locale={routing.defaultLocale}
        messages={messages}
      >
        {children}
      </NextIntlClientProvider>
    </ChakraProvider>
  );
}

/**
 * Use this instead of @testing-library/react's render: Chakra v3 components
 * throw without a ChakraProvider, and anything calling useTranslations needs
 * the next-intl provider with real messages — so a missing key fails the test
 * instead of silently rendering the key name.
 */
export function render(ui: ReactElement) {
  return testingLibraryRender(ui, { wrapper: Providers });
}

export { fireEvent, screen, waitFor, within } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
