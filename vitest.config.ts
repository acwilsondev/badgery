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
    ]
  }
});

