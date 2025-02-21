import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { ignores: ["**/.next/"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { settings: { react: { version: "19.0" } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettier,
];
