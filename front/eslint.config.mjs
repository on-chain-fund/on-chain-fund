import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Make unused variables warnings instead of errors
      "@typescript-eslint/no-unused-vars": "warn",
      // Make img element warnings instead of errors
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
