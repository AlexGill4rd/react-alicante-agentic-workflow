import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { EmotionRegistry } from "@/components/primitives/emotion-registry";
import { Provider } from "@/components/primitives/provider";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "React Alicante Companion",
  description: "Sessions, speakers, and your schedule for React Alicante",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <EmotionRegistry>
          <Provider>{children}</Provider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
