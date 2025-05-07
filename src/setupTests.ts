import '@testing-library/jest-dom/vitest';

// This file is executed before each test file
// It sets up the jest-dom matchers that extend the
// expect() functionality with DOM-specific matchers
// such as toBeInTheDocument(), toHaveClass(), etc.

// Note: whatwg-fetch is imported in vitest.config.ts via setupFiles
// so we don't need to import it here
