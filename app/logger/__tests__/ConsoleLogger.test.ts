import { describe, test, expect, beforeEach, vi } from 'vitest';
import { EnvConfigManager } from '../../config/EnvConfigManager';
import { ConsoleLogger } from '../ConsoleLogger';

// Define necessary types
type NodeEnv = 'development' | 'production' | 'staging';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Config {
  nodeEnv: NodeEnv;
  port: number;
  logLevel: LogLevel;
}

interface ConfigManager {
  getConfig(): Config;
  reload?(): Promise<void>;
  validate?(): Promise<boolean>;
}

// Mock implementation of ConfigManager
class MockConfigManager implements ConfigManager {
  constructor(private config: Config) {}

  getConfig(): Config {
    return this.config;
  }
}
describe('ConsoleLogger', () => {
  const mockConfig = {
    nodeEnv: 'development' as const,
    port: 3000,
    logLevel: 'debug' as const,
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // Reset the singleton instance between tests
    ConsoleLogger.resetInstance();
    // Reset config manager too as it's a dependency
    EnvConfigManager.resetInstance();
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('singleton pattern', () => {
    test('should return the same instance', () => {
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(mockConfig)
      );

      const instance1 = ConsoleLogger.getInstance();
      const instance2 = ConsoleLogger.getInstance();

      expect(instance1).toBe(instance2);
      expect(EnvConfigManager.getInstance).toHaveBeenCalledTimes(1);
    });

    test('should use config from EnvConfigManager', () => {
      const customConfig = { ...mockConfig, logLevel: 'info' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(customConfig)
      );

      const logger = ConsoleLogger.getInstance();

      // Log a message to test the configured level
      logger.debug('Debug message');
      logger.info('Info message');

      // Debug shouldn't be called with 'info' level
      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('log level hierarchy', () => {
    test('should respect configured level', () => {
      const customConfig = { ...mockConfig, logLevel: 'warn' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(customConfig)
      );

      const logger = ConsoleLogger.getInstance();

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');

      expect(console.debug).not.toHaveBeenCalled();
      expect(console.info).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('log formatting', () => {
    test('should include required fields', () => {
      const prodConfig = { ...mockConfig, nodeEnv: 'production' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(prodConfig)
      );

      const logger = ConsoleLogger.getInstance();

      logger.info('Test message');

      const call = (console.info as jest.Mock).mock.calls[0][0];
      const logObject = JSON.parse(call);

      expect(logObject).toEqual(
        expect.objectContaining({
          timestamp: expect.any(String),
          level: 'info',
          message: 'Test message',
          env: 'production',
        })
      );
      expect(new Date(logObject.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('should include error details', () => {
      const prodConfig = { ...mockConfig, nodeEnv: 'production' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(prodConfig)
      );

      const logger = ConsoleLogger.getInstance();
      const error = new Error('Test error');

      logger.error('Error occurred', error);

      const call = (console.error as jest.Mock).mock.calls[0][0];
      const logObject = JSON.parse(call);

      expect(logObject).toEqual(
        expect.objectContaining({
          message: 'Error occurred',
          error: expect.objectContaining({
            message: 'Test error',
            stack: expect.any(String),
          }),
        })
      );
    });
  });

  describe('environment-specific formatting', () => {
    test('development should use pretty print', () => {
      const devConfig = { ...mockConfig, nodeEnv: 'development' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(devConfig)
      );

      const logger = ConsoleLogger.getInstance();
      logger.info('Test message');

      const call = (console.info as jest.Mock).mock.calls[0][0];

      expect(call).toContain('\x1b[');
      expect(call).toContain('Test message');
      expect(call).toContain('INFO');
      expect(() => JSON.parse(call)).toThrow();
    });

    test('production should use JSON', () => {
      const prodConfig = { ...mockConfig, nodeEnv: 'production' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(prodConfig)
      );

      const logger = ConsoleLogger.getInstance();
      logger.info('Test message');

      const call = (console.info as jest.Mock).mock.calls[0][0];

      expect(() => JSON.parse(call)).not.toThrow();
      const logObject = JSON.parse(call);
      expect(logObject).toEqual(
        expect.objectContaining({
          timestamp: expect.any(String),
          level: 'info',
          message: 'Test message',
          env: 'production',
        })
      );
    });

    test('staging should use JSON', () => {
      const stagingConfig = { ...mockConfig, nodeEnv: 'staging' as const };
      vi.spyOn(EnvConfigManager, 'getInstance').mockReturnValue(
        new MockConfigManager(stagingConfig)
      );

      const logger = ConsoleLogger.getInstance();
      logger.info('Test message');

      const call = (console.info as jest.Mock).mock.calls[0][0];

      expect(() => JSON.parse(call)).not.toThrow();
      const logObject = JSON.parse(call);
      expect(logObject).toEqual(
        expect.objectContaining({
          timestamp: expect.any(String),
          level: 'info',
          message: 'Test message',
          env: 'staging',
        })
      );
    });
  });
});
