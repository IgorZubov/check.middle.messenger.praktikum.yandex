import eslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["/build", "**/*.min.js", "/node_modules"],
    languageOptions: {
      parser: eslintParser
    },
    plugins: {
      eslintPlugin
    }
  },
];
