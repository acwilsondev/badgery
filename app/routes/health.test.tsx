import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { loader } from './health';

// Mock JSON function to return a proper Response object
vi.mock('@remix-run/node', () => ({
  json: vi.fn((data, options) => {
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': options?.headers?.['Cache-Control'] || '',
        ...options?.headers,
      },
      status: options?.status || 200,
    });
  }),
}));

// Setup for process environment and functions
const originalEnv = { ...process.env };
const mockUptime = 123.456;

describe('Health Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Set a fixed date for consistent testing
    vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));

    // Set specific environment variables for testing
    process.env.NODE_ENV = 'test';
    process.env.npm_package_version = '1.0.0-test';

    // Mock the uptime function
    vi.spyOn(process, 'uptime').mockReturnValue(mockUptime);
  });

  afterEach(() => {
    vi.useRealTimers();

    // Restore the original environment
    process.env = { ...originalEnv };

    // Restore the original uptime function
    vi.restoreAllMocks();
  });

  it('should return the correct response structure', async () => {
    const response = await loader();
    const data = await response.json();

    // Check if the data has all the required fields
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('environment');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('version');

    // Check the structure is correct
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBe('2023-01-01T12:00:00.000Z');
    expect(data.version).toBe('1.0.0-test');
  });

  it('should have correct environment and uptime values', async () => {
    const response = await loader();
    const data = await response.json();
    // Verify the data has correct content
    expect(data).toEqual({
      status: 'ok',
      environment: 'test',
      uptime: 123.456,
      version: '1.0.0-test',
      timestamp: '2023-01-01T12:00:00.000Z',
    });
  });

  it('should return JSON with the correct HTTP status', async () => {
    const response = await loader();

    // Check the HTTP status and headers
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store, max-age=0');

    // Check data contents with flexible timestamp
    const data = await response.json();
    expect(data).toEqual(
      expect.objectContaining({
        status: 'ok',
        environment: 'test',
        uptime: 123.456,
        version: '1.0.0-test',
        timestamp: expect.any(String),
      })
    );
  });
});
