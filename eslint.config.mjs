import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  // Flat config lints only .js, .mjs and .cjs by default; without this entry .jsx files are skipped.
  {
    files: ["**/*.{js,jsx,mjs}"],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
