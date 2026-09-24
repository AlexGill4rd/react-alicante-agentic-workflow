"use client";

import { MenuToggleButton } from "@/components/atoms/menu-toggle-button";
import { LanguageToggle } from "@/components/molecules/language-toggle";
import { MobileMenu } from "@/components/molecules/mobile-menu";
import { NavLinks, type NavLink } from "@/components/molecules/nav-links";
import { Link, usePathname } from "@/i18n/navigation";
import { isStatsEnabled } from "@/utils/feature-flags";
import { Box, Flex } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  const links: NavLink[] = [
    { href: "/sessions", label: t("schedule") },
    { href: "/plan", label: t("plan") },
    { href: "/speakers", label: t("speakers") },
    ...(isStatsEnabled ? [{ href: "/stats", label: t("stats") }] : []),
    { href: "/news", label: t("news") },
  ];

  return (
    <Flex
      as="nav"
      position="sticky"
      top="0"
      zIndex="10"
      width="full"
      justify="center"
      borderBottomWidth="1px"
      borderColor="var(--card-border-hex)"
      background="var(--nav-bg)"
      css={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <Box
        width="full"
        maxWidth="6xl"
        paddingX={{ base: "5", md: "8" }}
        paddingY="3"
      >
        <Flex align="center" justify="space-between" gap="4">
          <Link href="/">
            <Box
              as="span"
              fontWeight="semibold"
              flexShrink="0"
              letterSpacing="-0.02em"
              transition="color var(--transition-fast)"
              _hover={{ color: "var(--accent-hex)" }}
            >
              {t("home")}
            </Box>
          </Link>

          <Flex display={{ base: "none", md: "flex" }} align="center" gap="6">
            <NavLinks links={links} pathname={pathname} />
          </Flex>

          <Flex display={{ base: "none", md: "flex" }} align="center" gap="4">
            <LanguageToggle />
          </Flex>

          <Box display={{ base: "inline-flex", md: "none" }}>
            <MenuToggleButton
              isOpen={open}
              onToggle={() => setOpen((previous) => !previous)}
              openLabel={t("openMenu")}
              closeLabel={t("closeMenu")}
            />
          </Box>
        </Flex>

        {open && (
          <MobileMenu>
            <NavLinks
              links={links}
              pathname={pathname}
              direction="column"
              onNavigate={() => setOpen(false)}
            />
            <LanguageToggle />
          </MobileMenu>
        )}
      </Box>
    </Flex>
  );
}
