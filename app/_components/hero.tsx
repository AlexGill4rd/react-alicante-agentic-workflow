"use client";

import { useLanguage } from "@/contexts/language-context";

export function Hero() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="sr-only">React Alicante Conference Companion</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        {t("hero.line1")}{" "}
        <span className="font-bold">React Alicante</span>, {t("hero.line2")}
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
