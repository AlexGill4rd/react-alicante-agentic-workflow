import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    body: {
      color: "var(--text-primary)",
    },
  },
});

export const system = createSystem(defaultConfig, config);
