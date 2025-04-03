import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
    setupFiles: [
      './src/setupTests.ts',  // For @testing-library/jest-dom setup
      'whatwg-fetch/fetch.js' // Polyfill for fetch API
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'build/**',
        'public/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/.eslintrc.*',
        '**/postcss.config.js',
        '**/tailwind.config.js',
        'coverage/**',
        // Remix framework files
        '**/entry.client.tsx',
        '**/entry.server.tsx',
        '**/root.tsx'
      ],
      include: [
        'app/**/*.{ts,tsx}'
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
        perFile: true
      }
    }
  }
});

