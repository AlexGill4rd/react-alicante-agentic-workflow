import { PageShell } from "@/components/templates/page-shell";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
