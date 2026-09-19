import { Flex, Heading, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

/** The title-and-subtitle block every page opens with. */
export function PageHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <Flex direction="column" gap="2">
      <Heading as="h1" fontSize="3xl" fontWeight="bold">
        {title}
      </Heading>
      {children ? <Text color="var(--text-muted)">{children}</Text> : null}
    </Flex>
  );
}
