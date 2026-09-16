"use client";

import { useLanguage } from "@/contexts/language-context";
import type { Language } from "@/utils/translations";
import { cn } from "@/utils/cn";
import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const LANGUAGES: Language[] = ["en", "es"];

export function SiteNav() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/sessions", label: t("nav.schedule") },
    { href: "/stats", label: t("nav.stats") },
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
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-current={language === lang ? "true" : undefined}
          className={cn(
            "uppercase text-xs font-semibold transition-colors",
            language === lang
              ? "text-[color:var(--accent-hex)]"
              : "text-[color:var(--text-muted)] hover:text-[color:var(--accent-hex)]",
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10">
      <div className="w-full max-w-5xl px-5 py-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-semibold shrink-0">
            React Alicante Companion
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

          <div className="hidden md:flex">{languageToggle}</div>

          <button
            type="button"
            className="md:hidden text-[color:var(--text-primary)]"
            aria-label={open ? "Close menu" : "Open menu"}
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
