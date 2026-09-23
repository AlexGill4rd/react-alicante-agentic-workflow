import { IconButton } from "@chakra-ui/react";
import { Menu, X } from "lucide-react";

export interface MenuToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
}

export function MenuToggleButton({
  isOpen,
  onToggle,
  openLabel,
  closeLabel,
}: MenuToggleButtonProps) {
  const Icon = isOpen ? X : Menu;

  return (
    <IconButton
      variant="plain"
      size="sm"
      color="var(--text-primary)"
      aria-label={isOpen ? closeLabel : openLabel}
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <Icon size={20} />
    </IconButton>
  );
}
