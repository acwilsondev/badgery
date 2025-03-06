/**
 * entry.client.tsx
 * 
 * This module is responsible for client-side hydration of the React application.
 * It uses React 18's createRoot API for concurrent rendering capabilities.
 */
import { startTransition, StrictMode } from "react";

import { RemixBrowser } from "@remix-run/react";
import { createRoot } from "react-dom/client";



// Get the root element where the React application will be mounted
const root = createRoot(document as unknown as HTMLElement);

// Wrap in startTransition to defer non-urgent updates
startTransition(() => {
  root.render(
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});

// Enable service worker registration for PWA capabilities if needed
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/entry.worker.js")
//       .then((registration) => {
//         console.log("Service worker registered:", registration);
//       })
//       .catch((error) => {
//         console.error("Error registering service worker:", error);
//       });
//   });
// }

