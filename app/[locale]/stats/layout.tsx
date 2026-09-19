import { PageShell } from "@/components/layout/page-shell";

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
