import { PageShell } from "@/components/layout/page-shell";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
