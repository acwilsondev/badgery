import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ConfigFactory } from '../ConfigFactory';

describe('ConfigFactory', () => {
  beforeEach(() => {
    // Clear any mocked environment variables between tests
    vi.resetModules();
    process.env = {};
  });

  test('should load default values when environment variables are not set', () => {
    const config = ConfigFactory.createConfig();
    
    expect(config).toEqual({
      nodeEnv: 'development',
      port: 3000,
      logLevel: 'debug'
    });
  });

  test('should accept valid staging environment configuration', () => {
    process.env.NODE_ENV = 'staging';
    process.env.PORT = '8080';
    process.env.LOG_LEVEL = 'info';

    const config = ConfigFactory.createConfig();
    
    expect(config).toEqual({
      nodeEnv: 'staging',
      port: 8080,
      logLevel: 'info'
    });
  });

  test('should accept valid production environment configuration', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = '8080';
    process.env.LOG_LEVEL = 'warn';

    const config = ConfigFactory.createConfig();
    
    expect(config).toEqual({
      nodeEnv: 'production',
      port: 8080,
      logLevel: 'warn'
    });
  });

  test('should handle uppercase environment values', () => {
    process.env.NODE_ENV = 'PRODUCTION';
    process.env.LOG_LEVEL = 'WARN';

    const config = ConfigFactory.createConfig();
    
    expect(config).toEqual({
      nodeEnv: 'production',
      port: 3000,
      logLevel: 'warn'
    });
  });

  test('should throw error for invalid NODE_ENV', () => {
    process.env.NODE_ENV = 'invalid';
    
    expect(() => ConfigFactory.createConfig())
      .toThrow('Invalid NODE_ENV: invalid. Must be one of: development, staging, production');
  });

  test('should throw error for invalid LOG_LEVEL', () => {
    process.env.LOG_LEVEL = 'invalid';
    
    expect(() => ConfigFactory.createConfig())
      .toThrow('Invalid LOG_LEVEL: invalid. Must be one of: debug, info, warn, error');
  });

  test('should throw error for invalid PORT', () => {
    process.env.PORT = 'not-a-number';
    
    expect(() => ConfigFactory.createConfig())
      .toThrow('Invalid PORT: not-a-number. Must be a number.');
  });
});
