import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    languageOptions: {
      ecmaVersion: 2024,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  { languageOptions: { globals: globals.browser } },
  {
    ignores: [
      ".vscode/",
      "node_modules/",
      ".github/",
      ".gitignore",
      ".jshintrc",
      "bookshelf.code-workspace",
      "package-lock.json",
      "package.json",
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...fixupConfigRules(pluginReactConfig),
];
