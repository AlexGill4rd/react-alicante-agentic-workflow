import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="sr-only">{t("heading")}</h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        {t("line1")} <span className="font-bold">React Alicante</span>,{" "}
        {t("line2")}
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
