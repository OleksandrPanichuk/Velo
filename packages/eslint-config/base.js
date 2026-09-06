import js from "@eslint/js";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export const prettierOptions = {
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: true,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  quoteProps: "as-needed",
};

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ...prettierRecommended,
    rules: {
      ...prettierRecommended.rules,
      "prettier/prettier": ["error", prettierOptions],
    },
  },
  {
    ignores: ["dist/**", "coverage/**", ".next/**", "test-results/**", "playwright-report/**", "eslint.config.*"],
  },
];
