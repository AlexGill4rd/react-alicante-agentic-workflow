import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

export function PageHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <Flex direction="column" gap="3" paddingBottom="2">
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="semibold"
        letterSpacing="-0.02em"
        lineHeight="tight"
      >
        {title}
      </Heading>
      {children ? (
        <Text
          fontSize="lg"
          lineHeight="relaxed"
          color="var(--text-muted)"
          maxWidth="2xl"
        >
          {children}
        </Text>
      ) : null}
      <Box
        width="full"
        maxWidth="xs"
        height="1px"
        marginTop="1"
        backgroundImage="linear-gradient(to right, var(--accent-hex), transparent)"
        opacity="0.5"
      />
    </Flex>
  );
}
