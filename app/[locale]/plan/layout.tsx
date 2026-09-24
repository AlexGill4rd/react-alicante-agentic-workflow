import { PageShell } from "@/components/templates/page-shell";
import type { ReactNode } from "react";

export default function PlanLayout({ children }: { children: ReactNode }) {
  return <PageShell>{children}</PageShell>;
}
