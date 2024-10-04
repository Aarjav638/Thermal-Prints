import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import pluginReactNative from 'eslint-plugin-react-native';

export default [
  // For JavaScript files
  {
    files: ['*.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-undef': 'off',
    },
  },

  // General settings for JS, TS, JSX, TSX files
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    ignores: ['node_modules/', 'ios/', 'android/', 'build/', 'dist/', 'test/'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
      prettier: prettierPlugin,
      reactNative: pluginReactNative,
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off', // For React 17+
      '@typescript-eslint/no-explicit-any': 'off', // Allow any type
    },
  },

  // For metro.config.js file
  {
    files: ['metro.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  // Detect React version
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // ESLint recommended configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettierConfig,
];
