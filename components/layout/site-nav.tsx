"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { isStatsEnabled } from "@/utils/feature-flags";
import { Menu as MenuIcon, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  // Locale-aware: the pathname comes back without the /en or /es prefix.
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/sessions", label: t("schedule") },
    ...(isStatsEnabled ? [{ href: "/stats", label: t("stats") }] : []),
    { href: "/news", label: t("news") },
  ];

  const linkClassName = (href: string) =>
    cn(
      "pb-1 border-b-2 border-transparent transition-colors",
      isActive(pathname, href)
        ? "text-[color:var(--accent-hex)] border-[color:var(--accent-hex)]"
        : "hover:text-[color:var(--accent-hex)]",
    );

  const languageToggle = (
    <div className="flex shrink-0 gap-2">
      {routing.locales.map((code: Locale) => (
        <button
          key={code}
          type="button"
          // Same route, different locale — the URL is the source of truth.
          onClick={() => router.replace(pathname, { locale: code })}
          aria-current={locale === code ? "true" : undefined}
          className={cn(
            "uppercase text-xs font-semibold transition-colors",
            locale === code
              ? "text-[color:var(--accent-hex)]"
              : "text-[color:var(--text-muted)] hover:text-[color:var(--accent-hex)]",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10">
      <div className="w-full max-w-5xl px-5 py-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold shrink-0">
            {t("home")}
          </Link>

          <div className="hidden md:flex items-center gap-5 font-semibold">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={linkClassName(href)}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {languageToggle}
          </div>

          <button
            type="button"
            className="md:hidden text-[color:var(--text-primary)]"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-3 font-semibold">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={linkClassName(href)}
                >
                  {label}
                </Link>
              ))}
            </div>
            {languageToggle}
          </div>
        )}
      </div>
    </nav>
  );
}
