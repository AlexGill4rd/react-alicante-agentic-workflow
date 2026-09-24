import { InteractiveSurface } from "@/components/atoms/interactive-surface";
import type { ReactNode } from "react";

export interface SurfaceCardProps {
  children: ReactNode;
}

export function SurfaceCard({ children }: SurfaceCardProps) {
  return <InteractiveSurface variant="compact">{children}</InteractiveSurface>;
}
