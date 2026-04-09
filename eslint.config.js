import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "test-results/**", "src/deck.generated.ts"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.test.ts"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: ["src/**/*.test.ts"],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    files: [
      "scripts/**/*.mjs",
      "scripts/**/*.ts",
      "tests/**/*.ts",
      "playwright.config.ts",
      "eslint.config.js"
    ],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
);
