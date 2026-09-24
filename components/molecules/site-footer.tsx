import { ThemeSwitcher } from "@/components/molecules/theme-switcher";
import { Flex, Link, Text } from "@chakra-ui/react";

export function SiteFooter() {
  return (
    <Flex
      as="footer"
      width="full"
      align="center"
      justify="center"
      gap="8"
      paddingY="20"
      fontSize="xs"
      color="var(--text-muted)"
      borderTopWidth="1px"
      borderColor="var(--card-border-hex)"
      backgroundImage="linear-gradient(to right, transparent, var(--card-border-hex), transparent)"
      backgroundSize="100% 1px"
      backgroundRepeat="no-repeat"
      backgroundPosition="top"
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
