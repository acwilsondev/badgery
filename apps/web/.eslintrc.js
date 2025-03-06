/**
 * ESLint Configuration for Badgery Web App
 * 
 * NOTE ON TYPESCRIPT VERSION:
 * ------------------------------
 * The project is currently using TypeScript 5.8.2, which is newer than what 
 * @typescript-eslint officially supports (currently supporting <5.4.0).
 * This causes various import resolution warnings when linting.
 * 
 * As a temporary workaround:
 * 1. Several import-related rules are set to 'warn' instead of 'error'
 * 2. Additional path configurations have been added in the resolver settings
 * 
 * FUTURE TODO:
 * - Either wait for @typescript-eslint to support the current TypeScript version
 * - Or downgrade TypeScript to a compatible version
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'jsx-a11y',
    'import',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['./tsconfig.json'],
        // Ensure these paths match the paths in tsconfig.json
        paths: {
          "~/*": ["./app/*"],
          "@remix-run/*": ["./node_modules/@remix-run/*"],
          "react": ["./node_modules/react"],
          "react-dom/*": ["./node_modules/react-dom/*"],
          "node:*": ["node:*"]
        },
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'app', '.'],
        resolvePaths: ['.', './node_modules'],
        paths: ['app'],
      },
    },
  },
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Not needed with TypeScript
    'react/jsx-uses-react': 'off', // Not needed in React 17+
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_', 
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Import rules
    // Temporarily reduce severity due to TypeScript version issues
    'import/no-unresolved': ['warn', { commonjs: true }],
    // Added these rules with reduced severity due to TypeScript version compatibility issues
    'import/namespace': 'warn',
    'import/default': 'warn',
    'import/no-extraneous-dependencies': ['warn', {
      devDependencies: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.js', '**/*.spec.ts', '**/*.spec.tsx', 'remix.config.js', '.eslintrc.js'],
    }],
    'import/order': [
      // Temporarily downgraded due to TypeScript version compatibility issues
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'external',
            'position': 'before'
          },
          {
            'pattern': '~/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }
    ],
    
    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'eqeqeq': ['error', 'always'],
  },
  overrides: [
    // Specific rules for test files
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    // Override for JavaScript files
    {
      files: ['*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: null, // Don't use tsconfig for JS files
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      }
    },
    // Override for config files
    {
      files: ['.eslintrc.js', 'remix.config.js', 'server.js'],
      env: {
        node: true
      },
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: null,
      }
    },
  ]
};
