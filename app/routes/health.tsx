import { json } from '@remix-run/node';

/**
 * Types for the health check response
 */
interface HealthCheckData {
  status: 'ok';
  timestamp: string;
  environment: string;
  uptime: number;
  version: string;
}

/**
 * Server-side loader function for the health check endpoint
 * Returns basic application health information
 */
export const loader = async () => {
  // Get application information
  const environment = process.env.NODE_ENV || 'development';
  const uptime = process.uptime(); // Server uptime in seconds

  // Create health check response
  const healthData: HealthCheckData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment,
    uptime,
    version: process.env.npm_package_version || 'unknown',
  };

  // Return JSON response with 200 status
  return json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
};

/**
 * This route doesn't render any UI, it's just a JSON endpoint
 */
export default function HealthCheck() {
  // This component won't be used when accessing the endpoint directly
  // since the JSON is returned before rendering, but is needed for Remix
  return null;
}
