"use client";

import { useLanguage } from "@/contexts/language-context";
import type { Language } from "@/utils/translations";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const LANGUAGES: Language[] = ["en", "es"];

export function SiteNav() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { href: "/", label: "React Alicante Companion" },
    { href: "/sessions", label: t("nav.schedule") },
    { href: "/stats", label: t("nav.stats") },
  ];

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={cn(
                "pb-1 border-b-2 border-transparent transition-colors",
                isActive(pathname, href)
                  ? "text-[color:var(--accent-hex)] border-[color:var(--accent-hex)]"
                  : "hover:text-[color:var(--accent-hex)]",
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2">
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
      </div>
    </nav>
  );
}
