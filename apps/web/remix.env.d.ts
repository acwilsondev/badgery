/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

/**
 * Declare known environment variables.
 * Enables type checking for usage of environment variables.
 * 
 * @see https://remix.run/docs/en/main/guides/envvars
 */
interface ENV {
  NODE_ENV: "development" | "production" | "test";
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

declare global {
  /**
   * Global ENV object for accessing environment variables at runtime.
   */
  const ENV: ENV;
  
  interface Window {
    ENV: ENV;
  }
}

/**
 * Add types for `handle` export on route modules
 * @see https://remix.run/docs/en/main/route/handle
 */
declare module "@remix-run/node" {
  export interface AppLoadContext {
    env: ENV;
  }
}

export {};

