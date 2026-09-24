import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { EmotionRegistry } from "@/components/theme/emotion-registry";
import { Provider } from "@/components/theme/provider";
import { routing } from "@/i18n/routing";
import "../globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "React Alicante Companion",
  description: "Sessions, speakers, and your schedule for React Alicante",
};

const roboto = Roboto({
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Keeps the pages below static.
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${roboto.variable} ${roboto.className}`}>
        <NextIntlClientProvider>
          <EmotionRegistry>
            <Provider>{children}</Provider>
          </EmotionRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
