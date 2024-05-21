//@ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import pluginSecurity from 'eslint-plugin-security';
import jest from 'eslint-plugin-jest';
import 'eslint-plugin-only-warn';

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs['flat/recommended'],
  pluginSecurity.configs.recommended,
  {
    files: ['__tests__/**'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off'
    }
  },
  {
    rules: {
      'unicorn/better-regex': 'warn'
    }
  }
];
