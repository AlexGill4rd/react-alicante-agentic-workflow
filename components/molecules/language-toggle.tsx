"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Button, Flex } from "@chakra-ui/react";
import { useLocale } from "next-intl";

export function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  return (
    <Flex gap="2" flexShrink="0">
      {routing.locales.map((code: Locale) => {
        const current = locale === code;

        return (
          <Button
            key={code}
            variant="plain"
            size="xs"
            padding="0"
            height="auto"
            minWidth="auto"
            textTransform="uppercase"
            fontWeight="semibold"
            aria-current={current ? "true" : undefined}
            color={current ? "var(--accent-hex)" : "var(--text-muted)"}
            _hover={{ color: "var(--accent-hex)" }}
            onClick={() => router.replace(pathname, { locale: code })}
          >
            {code}
          </Button>
        );
      })}
    </Flex>
  );
}
