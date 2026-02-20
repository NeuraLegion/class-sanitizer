import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import prettier from 'eslint-config-prettier';
export default defineConfig([
  {
    ignores: ['tmp', 'node_modules', 'dist']
  },
  js.configs.recommended,
  prettier,
  // -------------------------
  // Base JS environment
  // -------------------------
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2024
      }
    }
  },
  // -------------------------
  // TypeScript
  // -------------------------
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module'
      },
      globals: {
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        NodeJS: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        typescript: true
      }
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'no-public',
            constructors: 'no-public'
          }
        }
      ],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: [
              'public-static-field',
              'protected-static-field',
              'private-static-field',
              'public-instance-field',
              'protected-instance-field',
              'private-instance-field',
              'constructor',
              'public-static-method',
              'protected-static-method',
              'private-static-method',
              'public-abstract-method',
              'protected-abstract-method',
              'public-instance-method',
              'protected-instance-method',
              'private-instance-method'
            ]
          }
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid'
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE']
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        },
        {
          selector: 'function',
          format: ['PascalCase', 'camelCase']
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case']
        },
        {
          selector: 'method',
          modifiers: ['static'],
          format: ['camelCase', 'PascalCase']
        },
        {
          selector: 'property',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
          leadingUnderscore: 'allow'
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow'
        }
      ],
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true, ignoreProperties: true }
      ],
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: true,
          arrowParameter: false,
          memberVariableDeclaration: false,
          variableDeclarationIgnoreFunction: true
        }
      ],
      '@typescript-eslint/no-shadow': ['error', { hoist: 'all' }],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      'arrow-body-style': 'error',
      'camelcase': 'off',
      'complexity': ['error', { max: 10 }],
      'eqeqeq': ['error', 'smart'],
      'guard-for-in': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: false,
          optionalDependencies: false,
          peerDependencies: false
        }
      ],
      'import-x/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true
        }
      ],
      'import-x/order': [
        'error',
        {
          groups: [
            'index',
            ['sibling', 'parent'],
            'internal',
            'external',
            'builtin'
          ]
        }
      ],
      'max-classes-per-file': ['error', 1],
      'max-depth': ['error', { max: 2 }],
      'default-param-last': 'off',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-eval': 'error',
      'no-restricted-syntax': ['error', 'ForInStatement'],
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' }
      ],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'radix': 'error'
    }
  },
  // -------------------------
  // Jest tests
  // -------------------------
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', 'tests/**/*.ts'],
    plugins: {
      jest: jestPlugin
    },
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/prefer-expect-resolves': 'error',
      'jest/prefer-todo': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true
        }
      ]
    }
  }
]);
