import { Button } from "@/components/atoms/button";
import { Link } from "@/i18n/navigation";
import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import { getTranslations } from "next-intl/server";

export async function LandingPage() {
  const t = await getTranslations("Landing");

  const features = [
    {
      key: "schedule",
      title: t("features.schedule.title"),
      body: t("features.schedule.body"),
      href: "/sessions",
    },
    {
      key: "plan",
      title: t("features.plan.title"),
      body: t("features.plan.body"),
      href: "/plan",
    },
    {
      key: "speakers",
      title: t("features.speakers.title"),
      body: t("features.speakers.body"),
      href: "/speakers",
    },
    {
      key: "stats",
      title: t("features.stats.title"),
      body: t("features.stats.body"),
      href: "/stats",
    },
    {
      key: "news",
      title: t("features.news.title"),
      body: t("features.news.body"),
      href: "/news",
    },
    {
      key: "likes",
      title: t("features.likes.title"),
      body: t("features.likes.body"),
      href: "/sessions/opening-keynote",
    },
  ];

  const steps = [
    { title: t("how.step1.title"), body: t("how.step1.body") },
    { title: t("how.step2.title"), body: t("how.step2.body") },
    { title: t("how.step3.title"), body: t("how.step3.body") },
  ];

  return (
    <Flex direction="column" gap={{ base: "16", md: "24" }} width="full">
      <Box
        position="relative"
        overflow="hidden"
        borderRadius={{ base: "var(--radius-2xl)", md: "var(--radius-hero)" }}
        background="var(--md-surface-container)"
        boxShadow="var(--shadow-card-hover)"
        padding={{ base: "8", md: "16" }}
      >
        <Box
          aria-hidden
          position="absolute"
          top="-20%"
          right="-10%"
          width="280px"
          height="280px"
          borderRadius="full"
          background="var(--md-secondary-container)"
          filter="blur(48px)"
          opacity="0.9"
        />
        <Flex
          direction="column"
          align={{ base: "stretch", md: "flex-start" }}
          gap="6"
          position="relative"
          maxWidth="3xl"
        >
          <Text
            fontSize="sm"
            fontWeight="500"
            letterSpacing="0.04em"
            textTransform="uppercase"
            color="var(--md-primary)"
          >
            {t("hero.eyebrow")}
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "4xl", md: "6xl" }}
            lineHeight="1.15"
            fontWeight="500"
          >
            {t("hero.title")}
          </Heading>
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            lineHeight="1.6"
            color="var(--text-muted)"
            maxWidth="2xl"
          >
            {t("hero.subtitle")}
          </Text>
          <Flex gap="3" flexWrap="wrap" paddingTop="2">
            <Link href="/sessions">
              <Button type="button">{t("hero.ctaPrimary")}</Button>
            </Link>
            <Link href="/plan">
              <Button type="button" variant="secondary">
                {t("hero.ctaSecondary")}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Box>

      <Flex direction="column" gap="8" as="section">
        <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="500">
          {t("features.heading")}
        </Heading>
        <Grid
          gap="6"
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
        >
          {features.map((feature) => (
            <Link key={feature.key} href={feature.href}>
              <Box
                height="full"
                padding="6"
                borderRadius="var(--radius-xl)"
                background="var(--md-surface-container)"
                boxShadow="var(--shadow-card)"
                transition="all var(--transition-standard) var(--ease-md)"
                _hover={{
                  boxShadow: "var(--shadow-card-hover)",
                  transform: "scale(1.02)",
                }}
              >
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontWeight="500"
                  marginBottom="2"
                >
                  {feature.title}
                </Heading>
                <Text fontSize="sm" color="var(--text-muted)" lineHeight="1.6">
                  {feature.body}
                </Text>
              </Box>
            </Link>
          ))}
        </Grid>
      </Flex>

      <Flex direction="column" gap="8" as="section">
        <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="500">
          {t("how.heading")}
        </Heading>
        <Grid gap="6" templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}>
          {steps.map((step, index) => (
            <Box
              key={step.title}
              padding="6"
              borderRadius="var(--radius-xl)"
              background="var(--md-surface-container-low)"
            >
              <Box
                width="10"
                height="10"
                marginBottom="4"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="var(--radius-pill)"
                background="var(--md-secondary-container)"
                color="var(--md-on-secondary-container)"
                fontWeight="700"
                fontSize="sm"
              >
                {index + 1}
              </Box>
              <Heading as="h3" fontSize="lg" fontWeight="500" marginBottom="2">
                {step.title}
              </Heading>
              <Text fontSize="sm" color="var(--text-muted)" lineHeight="1.6">
                {step.body}
              </Text>
            </Box>
          ))}
        </Grid>
      </Flex>

      <Box
        as="section"
        padding={{ base: "8", md: "12" }}
        borderRadius="var(--radius-hero)"
        background="var(--md-primary)"
        color="var(--md-on-primary)"
        boxShadow="var(--shadow-card-hover)"
        textAlign="center"
      >
        <Heading
          as="h2"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="500"
          marginBottom="4"
        >
          {t("cta.title")}
        </Heading>
        <Text
          fontSize="lg"
          opacity="0.92"
          maxWidth="xl"
          marginX="auto"
          marginBottom="6"
        >
          {t("cta.body")}
        </Text>
        <Link href="/sessions">
          <Button type="button" variant="secondary">
            {t("cta.button")}
          </Button>
        </Link>
      </Box>
    </Flex>
  );
}
