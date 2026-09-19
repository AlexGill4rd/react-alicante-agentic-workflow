import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNav } from "@/components/layout/site-nav";
import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** Nav, centred content column, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <Flex as="main" direction="column" align="center" minHeight="100vh">
      <Flex direction="column" align="center" gap="20" flex="1" width="full">
        <SiteNav />

        <Flex
          direction="column"
          gap="20"
          flex="1"
          width="full"
          minWidth="0"
          maxWidth="5xl"
          padding="5"
        >
          {children}
        </Flex>

        <SiteFooter />
      </Flex>
    </Flex>
  );
}
