import { Flex } from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface MobileMenuProps {
  children: ReactNode;
}

export function MobileMenu({ children }: MobileMenuProps) {
  return (
    <Flex
      display={{ base: "flex", md: "none" }}
      direction="column"
      gap="4"
      marginTop="4"
      padding="4"
      borderRadius="var(--radius-xl)"
      borderWidth="1px"
      borderColor="var(--card-border-hex)"
      background="var(--surface)"
      boxShadow="var(--shadow-card)"
    >
      {children}
    </Flex>
  );
}
