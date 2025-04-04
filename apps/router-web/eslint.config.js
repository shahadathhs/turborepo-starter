import { config } from '@workspace/eslint-config/react-internal'

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: ['build/**', 'node_modules/**', '.react-router/**'],
  },
  ...config]
