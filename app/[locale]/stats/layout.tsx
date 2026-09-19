import { PageShell } from "@/components/templates/page-shell";

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
