# Contributing to Badgery

Thank you for your interest in contributing to Badgery! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Environment Setup](#development-environment-setup)
- [Project Structure](#project-structure)
- [Coding Conventions](#coding-conventions)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md) (please be respectful and collaborative).

## Development Environment Setup

Badgery is a monorepo managed with npm and Turborepo, using Remix as the main framework.

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (v7 or higher)
- Git

### Setup Steps

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/badgery.git
   cd badgery
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

   This will start all apps and services in development mode.

4. **Build the project**

   ```bash
   npm run build
   ```

## Project Structure

Badgery follows a monorepo structure:

```
badgery/
├── apps/           # Applications
│   ├── web/        # Main Remix web application
│   └── ...
├── packages/       # Shared packages
│   ├── ui/         # UI components
│   ├── utils/      # Utility functions
│   └── ...
├── docs/           # Documentation
├── .github/        # GitHub configuration
└── package.json    # Root package.json
```

## Coding Conventions

### JavaScript/TypeScript

- We use TypeScript for type safety
- Follow the ESLint configuration in the project
- Format code using Prettier
- Use functional components for React

### Naming Conventions

- **Files and directories**: kebab-case for file names, e.g., `user-profile.tsx`
- **Components**: PascalCase, e.g., `UserProfile`
- **Variables and functions**: camelCase, e.g., `getUserData`
- **Constants**: UPPER_SNAKE_CASE, e.g., `MAX_RETRY_COUNT`

### Import Order

1. External libraries
2. Internal modules
3. Component styles
4. Asset imports

### Component Structure

```tsx
// Imports
import React from 'react';
import { SomeComponent } from '../components';

// Types
interface Props {
  // ...
}

// Component
export function MyComponent({ prop1, prop2 }: Props) {
  // Hooks

  // Logic

  // Render
  return (
    // JSX
  );
}
```

## Development Workflow

1. **Create a branch for your work**

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Branch naming conventions:
   - `feature/` for new features
   - `fix/` for bug fixes
   - `docs/` for documentation changes
   - `refactor/` for code refactoring

2. **Make your changes and commit them**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

3. **Push your changes**

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a pull request**

## Testing Guidelines

We value thorough testing to maintain code quality.

### Running Tests

```bash
# Run all tests
npm test

# Run tests for a specific package or app
npm test -- --filter=web
```

### Test Structure

- Unit tests should be placed in a `__tests__` directory next to the code they test
- Test files should be named `[component-name].test.ts(x)`
- Use Jest for testing framework and React Testing Library for React components

### Test Coverage

Aim for high test coverage, especially for critical components and utility functions.

```bash
# Generate test coverage report
npm test -- --coverage
```

## Pull Request Process

1. **Ensure that your PR includes tests** for any new functionality or fixes
2. **Update documentation** if necessary
3. **Make sure all tests pass** and there are no linting errors
4. **Fill in the PR template** with all relevant information
5. **Request review** from at least one team member
6. **Address review comments** and make necessary changes
7. **Once approved**, your PR will be merged by a maintainer

### PR Title Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for PR titles:

```
type(scope): short description
```

Examples:
- `feat(auth): add OAuth login support`
- `fix(ui): resolve button alignment issue`
- `docs(readme): update installation instructions`

## Documentation

Clear documentation is essential. Please update the documentation when you:

- Add or modify features
- Change existing functionality
- Fix bugs that affect user experience

The main documentation is located in the `/docs` directory.

---

Thank you for contributing to Badgery! Your efforts help make this project better for everyone.

