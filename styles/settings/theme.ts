import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      backgroundColor: "var(--background-hex)",
      color: "var(--text-primary)",
    },
  },
});

export const system = createSystem(defaultConfig, config);
