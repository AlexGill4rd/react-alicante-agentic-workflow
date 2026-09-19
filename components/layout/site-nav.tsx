"use client";

import { LanguageToggle } from "@/components/layout/language-toggle";
import { NavLinks, type NavLink } from "@/components/layout/nav-links";
import { Link, usePathname } from "@/i18n/navigation";
import { isStatsEnabled } from "@/utils/feature-flags";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { Menu as MenuIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  const links: NavLink[] = [
    { href: "/sessions", label: t("schedule") },
    ...(isStatsEnabled ? [{ href: "/stats", label: t("stats") }] : []),
    { href: "/news", label: t("news") },
  ];

  return (
    <Flex
      as="nav"
      width="full"
      justify="center"
      borderBottomWidth="1px"
      borderColor="var(--card-border-hex)"
    >
      <Box width="full" maxWidth="5xl" paddingX="5" paddingY="3" fontSize="sm">
        <Flex align="center" justify="space-between" gap="4">
          <Link href="/">
            <Box as="span" fontWeight="semibold" flexShrink="0">
              {t("home")}
            </Box>
          </Link>

          <Flex display={{ base: "none", md: "flex" }} align="center" gap="5">
            <NavLinks links={links} pathname={pathname} />
          </Flex>

          <Flex display={{ base: "none", md: "flex" }} align="center" gap="4">
            <LanguageToggle />
          </Flex>

          <IconButton
            display={{ base: "inline-flex", md: "none" }}
            variant="plain"
            size="sm"
            color="var(--text-primary)"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((previous) => !previous)}
          >
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </IconButton>
        </Flex>

        {open && (
          <Flex
            display={{ base: "flex", md: "none" }}
            direction="column"
            gap="4"
            paddingTop="4"
          >
            <NavLinks
              links={links}
              pathname={pathname}
              direction="column"
              onNavigate={() => setOpen(false)}
            />
            <LanguageToggle />
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
