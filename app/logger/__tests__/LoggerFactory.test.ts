import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ConfigFactory } from '../../config/ConfigFactory';
import { LoggerFactory } from '../LoggerFactory';

describe('LoggerFactory', () => {
  const mockConfig = {
    nodeEnv: 'development' as const,
    port: 3000,
    logLevel: 'debug' as const
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // Reset the singleton instance between tests
    // @ts-expect-error accessing private for testing
    LoggerFactory.instance = undefined;
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('singleton pattern', () => {
    test('should return the same instance', () => {
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(mockConfig);
      
      const instance1 = LoggerFactory.getInstance();
      const instance2 = LoggerFactory.getInstance();
      
      expect(instance1).toBe(instance2);
      expect(ConfigFactory.createConfig).toHaveBeenCalledTimes(1);
    });

    test('should use config from ConfigFactory', () => {
      const customConfig = { ...mockConfig, logLevel: 'info' as const };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(customConfig);
      
      const logger = LoggerFactory.getInstance();
      
      // @ts-expect-error accessing private for testing
      expect(logger.logLevel).toBe('info');
    });
  });

  describe('log level hierarchy', () => {
    test('should respect configured level', () => {
      const customConfig = { ...mockConfig, logLevel: 'warn' as const };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(customConfig);
      
      const logger = LoggerFactory.getInstance();
      
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
      const prodConfig = { ...mockConfig, nodeEnv: 'production' };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(prodConfig);
      const logger = LoggerFactory.getInstance();
      
      logger.info('Test message');
      
      const call = (console.info as jest.Mock).mock.calls[0][0];
      const logObject = JSON.parse(call);
      
      expect(logObject).toEqual(expect.objectContaining({
        timestamp: expect.any(String),
        level: 'info',
        message: 'Test message',
        env: 'production'
      }));
      expect(new Date(logObject.timestamp).toString()).not.toBe('Invalid Date');
    });

    test('should include error details', () => {
      const prodConfig = { ...mockConfig, nodeEnv: 'production' };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(prodConfig);
      const logger = LoggerFactory.getInstance();
      const error = new Error('Test error');
      
      logger.error('Error occurred', error);
      
      const call = (console.error as jest.Mock).mock.calls[0][0];
      const logObject = JSON.parse(call);
      
      expect(logObject).toEqual(expect.objectContaining({
        message: 'Error occurred',
        error: expect.objectContaining({
          message: 'Test error',
          stack: expect.any(String)
        })
      }));
    });
  });

  describe('environment-specific formatting', () => {
    test('development should use pretty print', () => {
      const devConfig = { ...mockConfig, nodeEnv: 'development' };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(devConfig);
      
      const logger = LoggerFactory.getInstance();
      logger.info('Test message');
      
      const call = (console.info as jest.Mock).mock.calls[0][0];
      
      expect(call).toContain('\x1b[');
      expect(call).toContain('Test message');
      expect(call).toContain('INFO');
      expect(() => JSON.parse(call)).toThrow();
    });

    test('production should use JSON', () => {
      const prodConfig = { ...mockConfig, nodeEnv: 'production' };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(prodConfig);
      
      const logger = LoggerFactory.getInstance();
      logger.info('Test message');
      
      const call = (console.info as jest.Mock).mock.calls[0][0];
      
      expect(() => JSON.parse(call)).not.toThrow();
      const logObject = JSON.parse(call);
      expect(logObject).toEqual(expect.objectContaining({
        timestamp: expect.any(String),
        level: 'info',
        message: 'Test message',
        env: 'production'
      }));
    });

    test('staging should use JSON', () => {
      const stagingConfig = { ...mockConfig, nodeEnv: 'staging' };
      vi.spyOn(ConfigFactory, 'createConfig').mockReturnValue(stagingConfig);
      
      const logger = LoggerFactory.getInstance();
      logger.info('Test message');
      
      const call = (console.info as jest.Mock).mock.calls[0][0];
      
      expect(() => JSON.parse(call)).not.toThrow();
      const logObject = JSON.parse(call);
      expect(logObject).toEqual(expect.objectContaining({
        timestamp: expect.any(String),
        level: 'info',
        message: 'Test message',
        env: 'staging'
      }));
    });
  });
});
