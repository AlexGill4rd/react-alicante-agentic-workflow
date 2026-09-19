import { PageShell } from "@/components/templates/page-shell";

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
