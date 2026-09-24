import { PageShell } from "@/components/templates/page-shell";

export default function SpeakersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageShell>{children}</PageShell>;
}
