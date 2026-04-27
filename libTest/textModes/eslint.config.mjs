import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([{
    ignores: [
      "**/*.json",
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
    ],
    extends: compat.extends(
      "eslint:recommended",
      "plugin:react/recommended",
    //   "airbnb",
      "prettier",
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.jest,
        globalThis: false,
      },

      parser: tsParser,
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/resolver": {
            node: {
                extensions: [".ts", ".tsx"],
            },

            alias: {
                map: [["src", "./src"], ["charchem", "../../src"]],
                extensions: [".ts", ".tsx"],
            },
        },
    },

    rules: {
      "no-plusplus": "off",
      "no-continue": "off",

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          caughtErrors: "none",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },

}]);