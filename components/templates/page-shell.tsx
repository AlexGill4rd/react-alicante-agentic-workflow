import { SiteFooter } from "@/components/molecules/site-footer";
import { SiteNav } from "@/components/organisms/site-nav";
import { AmbientBackground } from "@/components/theme/ambient-background";
import { Box, Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** Nav, centred content column, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <Box position="relative" minHeight="100vh">
      <AmbientBackground />
      <Flex
        as="main"
        direction="column"
        align="center"
        position="relative"
        zIndex="1"
        minHeight="100vh"
      >
        <Flex direction="column" align="center" gap="16" flex="1" width="full">
          <SiteNav />

          <Flex
            direction="column"
            gap="16"
            flex="1"
            width="full"
            minWidth="0"
            maxWidth="6xl"
            paddingX={{ base: "5", md: "8" }}
            paddingBottom="8"
          >
            {children}
          </Flex>

          <SiteFooter />
        </Flex>
      </Flex>
    </Box>
  );
}
