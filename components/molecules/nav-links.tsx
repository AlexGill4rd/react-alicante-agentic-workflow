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
      gap={direction === "row" ? "2" : "2"}
      align={direction === "row" ? "center" : "stretch"}
      fontSize="sm"
      fontWeight="medium"
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
              paddingX="3"
              paddingY="1.5"
              borderRadius="var(--radius-lg)"
              color={active ? "var(--text-primary)" : "var(--text-secondary)"}
              background={active ? "var(--surface-hover)" : "transparent"}
              borderWidth="1px"
              borderColor={
                active ? "var(--card-border-hover-hex)" : "transparent"
              }
              boxShadow={
                active ? "inset 0 1px 0 0 rgba(255,255,255,0.06)" : "none"
              }
              transition="background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)"
              _hover={{
                color: "var(--text-primary)",
                background: "var(--surface)",
                borderColor: "var(--card-border-hex)",
              }}
            >
              {label}
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
}
