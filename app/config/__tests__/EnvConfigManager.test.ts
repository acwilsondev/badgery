import { describe, test, expect, beforeEach, vi } from 'vitest';
import { EnvConfigManager } from '../EnvConfigManager';

describe('EnvConfigManager', () => {
  beforeEach(() => {
    // Clear any mocked environment variables between tests
    vi.resetModules();
    process.env = {};
    // Reset the singleton instance between tests
    EnvConfigManager.resetInstance();
  });

  describe('Instance Management', () => {
    test('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = EnvConfigManager.getInstance();
      const instance2 = EnvConfigManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Configuration Loading', () => {
    test('should load default values when environment variables are not set', () => {
      const manager = EnvConfigManager.getInstance();
      const config = manager.getConfig();
      
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

      const manager = EnvConfigManager.getInstance();
      const config = manager.getConfig();
      
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

      const manager = EnvConfigManager.getInstance();
      const config = manager.getConfig();
      
      expect(config).toEqual({
        nodeEnv: 'production',
        port: 8080,
        logLevel: 'warn'
      });
    });

    test('should handle uppercase environment values', () => {
      process.env.NODE_ENV = 'PRODUCTION';
      process.env.LOG_LEVEL = 'WARN';

      const manager = EnvConfigManager.getInstance();
      const config = manager.getConfig();
      
      expect(config).toEqual({
        nodeEnv: 'production',
        port: 3000,
        logLevel: 'warn'
      });
    });
  });

  describe('Validation', () => {
    test('should throw error for invalid NODE_ENV', () => {
      process.env.NODE_ENV = 'invalid';
      
      expect(() => EnvConfigManager.getInstance())
        .toThrow('Invalid NODE_ENV: invalid. Must be one of: development, staging, production');
    });

    test('should throw error for invalid LOG_LEVEL', () => {
      process.env.LOG_LEVEL = 'invalid';
      
      expect(() => EnvConfigManager.getInstance())
        .toThrow('Invalid LOG_LEVEL: invalid. Must be one of: debug, info, warn, error');
    });

    test('should throw error for invalid PORT', () => {
      process.env.PORT = 'not-a-number';
      
      expect(() => EnvConfigManager.getInstance())
        .toThrow('Invalid PORT: not-a-number. Must be a number.');
    });

    test('should validate configuration successfully', async () => {
      const manager = EnvConfigManager.getInstance();
      const isValid = await manager.validate();
      expect(isValid).toBe(true);
    });

    test('should fail validation for invalid config', async () => {
      const manager = EnvConfigManager.getInstance();
      // @ts-expect-error testing invalid state
      manager['currentConfig'].nodeEnv = 'invalid';
      const isValid = await manager.validate();
      expect(isValid).toBe(false);
    });
  });

  describe('Configuration Reloading', () => {
    test('should reload configuration from environment', async () => {
      const manager = EnvConfigManager.getInstance();
      const initialConfig = manager.getConfig();

      process.env.NODE_ENV = 'production';
      process.env.PORT = '8080';
      process.env.LOG_LEVEL = 'warn';

      await manager.reload();
      const newConfig = manager.getConfig();

      expect(newConfig).not.toEqual(initialConfig);
      expect(newConfig).toEqual({
        nodeEnv: 'production',
        port: 8080,
        logLevel: 'warn'
      });
    });
  });
});

