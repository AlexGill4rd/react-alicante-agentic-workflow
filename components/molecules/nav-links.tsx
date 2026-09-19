"use client";

import { Link } from "@/i18n/navigation";
import { Flex } from "@chakra-ui/react";

export interface NavLink {
  href: string;
  label: string;
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavLinksProps {
  links: NavLink[];
  pathname: string;
  direction?: "row" | "column";
  onNavigate?: () => void;
}

export function NavLinks({
  links,
  pathname,
  direction = "row",
  onNavigate,
}: NavLinksProps) {
  return (
    <Flex
      direction={direction}
      gap={direction === "row" ? "5" : "3"}
      align={direction === "row" ? "center" : "stretch"}
      fontWeight="semibold"
    >
      {links.map(({ href, label }) => {
        const active = isActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
          >
            <Flex
              as="span"
              paddingBottom="1"
              borderBottomWidth="2px"
              borderColor={active ? "var(--accent-hex)" : "transparent"}
              color={active ? "var(--accent-hex)" : undefined}
              transition="color 0.2s, border-color 0.2s"
              _hover={{ color: "var(--accent-hex)" }}
            >
              {label}
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
}
