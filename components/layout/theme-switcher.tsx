"use client";

import { Button } from "@/components/primitives/button";
import { Menu, Portal } from "@chakra-ui/react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useIsClient } from "@/hooks/use-is-client";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <Menu.Root positioning={{ placement: "bottom-start" }}>
      <Menu.Trigger asChild>
        <Button variant="ghost" size={"sm"}>
          {theme === "light" ? (
            <Sun key="light" size={ICON_SIZE} />
          ) : theme === "dark" ? (
            <Moon key="dark" size={ICON_SIZE} />
          ) : (
            <Laptop key="system" size={ICON_SIZE} />
          )}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            css={{
              background: "var(--surface-hex)",
              borderColor: "var(--card-border-hex)",
            }}
          >
            <Menu.RadioItemGroup
              value={theme}
              onValueChange={(e) => setTheme(e.value)}
            >
              <Menu.RadioItem value="light" display="flex" gap="2">
                <Sun size={ICON_SIZE} /> <span>Light</span>
                <Menu.ItemIndicator ml="auto" />
              </Menu.RadioItem>
              <Menu.RadioItem value="dark" display="flex" gap="2">
                <Moon size={ICON_SIZE} /> <span>Dark</span>
                <Menu.ItemIndicator ml="auto" />
              </Menu.RadioItem>
              <Menu.RadioItem value="system" display="flex" gap="2">
                <Laptop size={ICON_SIZE} /> <span>System</span>
                <Menu.ItemIndicator ml="auto" />
              </Menu.RadioItem>
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export { ThemeSwitcher };
