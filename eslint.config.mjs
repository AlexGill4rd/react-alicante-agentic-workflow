import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships flat config directly — no FlatCompat wrapper.
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "types/supabase.types.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
