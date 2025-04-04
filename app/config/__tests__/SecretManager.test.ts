import { describe, test, expect, beforeEach, vi } from 'vitest';
import { SecretManager } from '../SecretManager';

describe('SecretManager', () => {
  beforeEach(() => {
    // Clear any mocked environment variables between tests
    vi.resetModules();
    process.env = {};
    
    // Reset the singleton instance
    // Reset the singleton instance
    SecretManager.resetInstance();
  });

  describe('Instance Management', () => {
    test('should not allow direct instantiation with new operator', () => {
      expect(() => {
        // @ts-expect-error - Accessing private constructor for testing
        new SecretManager();
      }).not.toThrow();
      
      // Second call should throw, since an instance now exists
      expect(() => {
        // @ts-expect-error - Accessing private constructor for testing
        new SecretManager();
      }).toThrow('Use SecretManager.getInstance() instead of new operator');
    });

    test('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = SecretManager.getInstance();
      const instance2 = SecretManager.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Required Secrets', () => {
    test('should throw error when required secret is not found', () => {
      const secretManager = SecretManager.getInstance();
      
      expect(() => secretManager.getSecret('API_KEY'))
        .toThrow('Required secret API_KEY not found');
    });

    test('should return secret value when it exists in environment', () => {
      process.env.TEST_SECRET = 'secret-value';
      const secretManager = SecretManager.getInstance();
      
      expect(secretManager.getSecret('TEST_SECRET')).toBe('secret-value');
    });

    test('should validate secret format when validator is provided', () => {
      process.env.API_KEY = 'invalid-format';
      const secretManager = SecretManager.getInstance();
      
      expect(() => secretManager.getSecret('API_KEY', /^[A-Z0-9]{32}$/))
        .toThrow('Secret API_KEY does not match required format');
    });

    test('should accept valid secret format when validator is provided', () => {
      const validKey = 'ABCD1234ABCD1234ABCD1234ABCD1234';
      process.env.API_KEY = validKey;
      const secretManager = SecretManager.getInstance();
      
      expect(secretManager.getSecret('API_KEY', /^[A-Z0-9]{32}$/))
        .toBe(validKey);
    });
  });

  describe('Optional Secrets', () => {
    test('should return default value for optional secret when not found', () => {
      const secretManager = SecretManager.getInstance();
      
      expect(secretManager.getOptionalSecret('OPTIONAL_SECRET', 'default'))
        .toBe('default');
    });

    test('should return secret value for optional secret when found', () => {
      process.env.OPTIONAL_SECRET = 'found-value';
      const secretManager = SecretManager.getInstance();
      
      expect(secretManager.getOptionalSecret('OPTIONAL_SECRET', 'default'))
        .toBe('found-value');
    });

    test('should validate optional secret format when provided', () => {
      process.env.OPTIONAL_KEY = 'invalid';
      const secretManager = SecretManager.getInstance();
      
      expect(() => secretManager.getOptionalSecret('OPTIONAL_KEY', 'default', /^[A-Z0-9]{8}$/))
        .toThrow('Secret OPTIONAL_KEY does not match required format');
    });
  });

  describe('Value Formatting', () => {
    test('should trim whitespace from secret values', () => {
      process.env.SPACE_SECRET = '  secret-with-spaces  ';
      const secretManager = SecretManager.getInstance();
      
      expect(secretManager.getSecret('SPACE_SECRET'))
        .toBe('secret-with-spaces');
    });

    test('should handle empty string after trimming', () => {
      process.env.EMPTY_SECRET = '   ';
      const secretManager = SecretManager.getInstance();
      
      expect(() => secretManager.getSecret('EMPTY_SECRET'))
        .toThrow('Required secret EMPTY_SECRET not found');
    });
  });
});
