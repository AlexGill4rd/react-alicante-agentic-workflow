import { IconButton } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

export interface IconToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
  onIcon: LucideIcon;
  offIcon: LucideIcon;
  onLabel: string;
  offLabel: string;
}

export function IconToggleButton({
  isOn,
  onToggle,
  onIcon,
  offIcon,
  onLabel,
  offLabel,
}: IconToggleButtonProps) {
  const Icon = isOn ? onIcon : offIcon;

  return (
    <IconButton
      variant="plain"
      size="sm"
      color="var(--text-primary)"
      aria-label={isOn ? onLabel : offLabel}
      aria-expanded={isOn}
      onClick={onToggle}
    >
      <Icon size={20} />
    </IconButton>
  );
}
