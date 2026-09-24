import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <Flex
      as="section"
      direction="column"
      align="center"
      gap="8"
      paddingTop={{ base: "8", md: "16" }}
      paddingBottom="4"
      textAlign="center"
    >
      <Heading as="h1" srOnly>
        {t("heading")}
      </Heading>

      <Text
        fontSize="xs"
        fontFamily="mono"
        letterSpacing="0.2em"
        textTransform="uppercase"
        color="var(--text-muted)"
      >
        React Alicante 2026
      </Text>

      <Text
        fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
        lineHeight="1.05"
        maxWidth="4xl"
        marginX="auto"
        fontWeight="semibold"
        letterSpacing="-0.03em"
        css={{
          backgroundImage:
            "linear-gradient(180deg, var(--text-primary) 0%, rgba(237,237,239,0.75) 100%)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {t("line1")}{" "}
        <Text
          as="span"
          css={{
            backgroundImage:
              "linear-gradient(90deg, var(--accent-hex), var(--accent-muted), var(--accent-hex))",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          React Alicante
        </Text>
        , {t("line2")}
      </Text>

      <Box
        width="full"
        maxWidth="md"
        height="1px"
        marginTop="4"
        backgroundImage="linear-gradient(to right, transparent, var(--card-border-hover-hex), transparent)"
      />
    </Flex>
  );
}
