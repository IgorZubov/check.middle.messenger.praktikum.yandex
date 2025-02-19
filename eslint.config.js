import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier/recommended';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const compat = new FlatCompat({
    baseDirectory: dirname,
});

export default tseslint.config(
    // eslint.configs.recommended,
    // importPlugin.flatConfigs.recommended,
    // ...compat.extends('airbnb-base'),
    // ...tseslint.configs.recommendedTypeChecked,
    // ...tseslint.configs.recommended,
    // eslintConfigPrettier,
    // eslintPluginPrettierRecommended,
    {
        ignores: [
            '.github',
            '.idea',
            '.vscode',
            'node_modules',
            'public',
            'dist',
            'static',
            '**/*.config.js',
            '**/*.d.ts',
            'server.mjs',
        ],
    },
    {
        files: ['src/**/*.{js,mjs,cjs,ts}'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            tseslint.configs.disableTypeChecked,
            // importPlugin.flatConfigs.recommended,
            eslintConfigPrettier,
            prettier,
        ],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        settings: {
            'import/resolver': {
                node: true,
                typescript: {
                    project: './tsconfig.json'
                },
            },
            "import/extensions": [
                ".js",
                // ".ts",
            ],
            "import/ignore": [
                "\.(scss|less|css|pcss)$",
                "\.(hbs)$",
                "\.(ts)$",
            ],
        },
    },
    {
        rules: {
            semi: ['error', 'always'],
            'eol-last': ['error', 'always'],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            // 'import/newline-after-import': ['error', { count: 2 }],
        },
    },
);
