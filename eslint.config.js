import tsParser from '@typescript-eslint/parser'
import { config } from '@workspace/eslint-config/base.js'

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['apps/**', 'packages/**'],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
  },
  // Spread the base configuration
  ...config,
]
