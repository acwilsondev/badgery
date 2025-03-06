import { cssBundleHref } from "@remix-run/css-bundle";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

// Import global styles if needed
// import globalStylesUrl from "~/styles/global.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  // Add your global styles here
  // { rel: "stylesheet", href: globalStylesUrl },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          {/* Add your header/navigation here */}
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          {/* Add your footer content here */}
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

// Error boundary for handling route errors
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Error | Badgery</title>
      </head>
      <body>
        <div className="error-container">
          <h1>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
              ? error.message
              : "Unknown Error"}
          </h1>
          {isRouteErrorResponse(error) && (
            <p>{error.data?.message || "Something went wrong!"}</p>
          )}
          <p>The app has encountered an error. Please try again later.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

