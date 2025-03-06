# Badgery Web Application

This is the web application for Badgery, built with Remix, React 18+, and TypeScript.

## Prerequisites

- Node.js v18 or higher
- npm v8 or higher

## Getting Started

Since this application is part of a monorepo, you can run commands from the root directory or from this directory.

### Install Dependencies

From the root directory:

```bash
npm install
```

Or from this directory:

```bash
npm install
```

### Development

To start the development server:

From the root directory:

```bash
npm run dev
```

Or specifically for the web app:

```bash
npm run dev --workspace=apps/web
```

From this directory:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production:

From the root directory:

```bash
npm run build
```

Or specifically for the web app:

```bash
npm run build --workspace=apps/web
```

From this directory:

```bash
npm run build
```

### Starting Production Server

To start the production server after building:

From the root directory:

```bash
npm run start --workspace=apps/web
```

From this directory:

```bash
npm run start
```

## Project Structure

```
apps/web/
├── app/               # Main application code
│   ├── routes/        # Application routes
│   ├── entry.client.tsx  # Client entry point
│   ├── entry.server.tsx  # Server entry point
│   └── root.tsx       # Root component
├── public/            # Static assets
├── .eslintrc.js       # ESLint configuration
├── .prettierrc        # Prettier configuration
├── package.json       # Package configuration
├── remix.config.js    # Remix configuration
├── remix.env.d.ts     # TypeScript declarations for Remix
├── server.js          # Server entry point
└── tsconfig.json      # TypeScript configuration
```

## TypeScript

This project uses TypeScript with strict mode enabled. Make sure your code adheres to TypeScript standards.

## Linting and Formatting

This project uses ESLint and Prettier for code linting and formatting.

To lint the code:

```bash
npm run lint
```

To format the code:

```bash
npm run format
```

