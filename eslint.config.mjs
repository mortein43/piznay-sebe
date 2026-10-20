import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "out/**", "build/**", ".vercel/**", "coverage/**", "next-env.d.ts"],
  },
  // Flat config lints only .js, .mjs and .cjs by default; without this entry .jsx, .ts and .tsx files are skipped.
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
  },
  ...compat.extends("next/core-web-vitals"),
  // TypeScript rules apply to TypeScript files only, so JavaScript is linted as before until it is converted.
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
  },
]);

export default eslintConfig;
