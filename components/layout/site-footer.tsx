import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Flex, Link, Text } from "@chakra-ui/react";

export function SiteFooter() {
  return (
    <Flex
      as="footer"
      width="full"
      align="center"
      justify="center"
      gap="8"
      paddingY="16"
      fontSize="xs"
      borderTopWidth="1px"
      borderColor="var(--card-border-hex)"
    >
      <Text>
        Powered by{" "}
        <Link
          href="https://supabase.com"
          target="_blank"
          rel="noreferrer"
          fontWeight="bold"
          color="var(--text-primary)"
        >
          Supabase
        </Link>
      </Text>
      <ThemeSwitcher />
    </Flex>
  );
}
