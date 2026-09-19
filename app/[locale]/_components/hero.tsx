import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <Flex direction="column" align="center" gap="16">
      <Heading as="h1" srOnly>
        {t("heading")}
      </Heading>

      <Text
        fontSize={{ base: "3xl", lg: "4xl" }}
        lineHeight="tight"
        maxWidth="xl"
        marginX="auto"
        textAlign="center"
      >
        {t("line1")}{" "}
        <Text as="span" fontWeight="bold">
          React Alicante
        </Text>
        , {t("line2")}
      </Text>

      {/* Hairline divider that fades out at both ends. */}
      <Box
        width="full"
        height="1px"
        marginY="8"
        backgroundImage="linear-gradient(to right, transparent, var(--card-border-hex), transparent)"
      />
    </Flex>
  );
}
