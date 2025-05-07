import { describe, test, expect, beforeEach, vi } from 'vitest';
import { EnvSecretManager } from '../EnvSecretManager';

describe('EnvSecretManager', () => {
  beforeEach(() => {
    // Clear any mocked environment variables between tests
    vi.resetModules();
    process.env = {};

    // Reset the singleton instance
    EnvSecretManager.resetInstance();
  });

  describe('Instance Management', () => {
    test('should not allow direct instantiation with new operator', () => {
      expect(() => {
        // @ts-expect-error - Accessing private constructor for testing
        new EnvSecretManager();
      }).not.toThrow();

      // Second call should throw, since an instance now exists
      expect(() => {
        // @ts-expect-error - Accessing private constructor for testing
        new EnvSecretManager();
      }).toThrow('Use EnvSecretManager.getInstance() instead of new operator');
    });

    test('should return the same instance when getInstance is called multiple times', () => {
      const instance1 = EnvSecretManager.getInstance();
      const instance2 = EnvSecretManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('Required Secrets', () => {
    test('should throw error when required secret is not found', async () => {
      const secretManager = EnvSecretManager.getInstance();

      await expect(secretManager.getSecret('API_KEY')).rejects.toThrow(
        'Required secret API_KEY not found'
      );
    });

    test('should return secret value when it exists in environment', async () => {
      process.env.TEST_SECRET = 'secret-value';
      const secretManager = EnvSecretManager.getInstance();

      const value = await secretManager.getSecret('TEST_SECRET');
      expect(value).toBe('secret-value');
    });

    test('should validate secret format when validator is provided', async () => {
      process.env.API_KEY = 'invalid-format';
      const secretManager = EnvSecretManager.getInstance();

      await expect(
        secretManager.getSecret('API_KEY', /^[A-Z0-9]{32}$/)
      ).rejects.toThrow('Secret API_KEY does not match required format');
    });

    test('should accept valid secret format when validator is provided', async () => {
      const validKey = 'ABCD1234ABCD1234ABCD1234ABCD1234';
      process.env.API_KEY = validKey;
      const secretManager = EnvSecretManager.getInstance();

      const value = await secretManager.getSecret('API_KEY', /^[A-Z0-9]{32}$/);
      expect(value).toBe(validKey);
    });
  });

  describe('Optional Secrets', () => {
    test('should return default value for optional secret when not found', async () => {
      const secretManager = EnvSecretManager.getInstance();

      const value = await secretManager.getOptionalSecret(
        'OPTIONAL_SECRET',
        'default'
      );
      expect(value).toBe('default');
    });

    test('should return secret value for optional secret when found', async () => {
      process.env.OPTIONAL_SECRET = 'found-value';
      const secretManager = EnvSecretManager.getInstance();

      const value = await secretManager.getOptionalSecret(
        'OPTIONAL_SECRET',
        'default'
      );
      expect(value).toBe('found-value');
    });

    test('should validate optional secret format when provided', async () => {
      process.env.OPTIONAL_KEY = 'invalid';
      const secretManager = EnvSecretManager.getInstance();

      await expect(
        secretManager.getOptionalSecret(
          'OPTIONAL_KEY',
          'default',
          /^[A-Z0-9]{8}$/
        )
      ).rejects.toThrow('Secret OPTIONAL_KEY does not match required format');
    });
  });

  describe('Value Formatting', () => {
    test('should trim whitespace from secret values', async () => {
      process.env.SPACE_SECRET = '  secret-with-spaces  ';
      const secretManager = EnvSecretManager.getInstance();

      const value = await secretManager.getSecret('SPACE_SECRET');
      expect(value).toBe('secret-with-spaces');
    });

    test('should handle empty string after trimming', async () => {
      process.env.EMPTY_SECRET = '   ';
      const secretManager = EnvSecretManager.getInstance();

      await expect(secretManager.getSecret('EMPTY_SECRET')).rejects.toThrow(
        'Required secret EMPTY_SECRET not found'
      );
    });
  });

  describe('Secret Existence Check', () => {
    test('should return true for existing secret', async () => {
      process.env.EXISTING_SECRET = 'value';
      const secretManager = EnvSecretManager.getInstance();

      const exists = await secretManager.hasSecret('EXISTING_SECRET');
      expect(exists).toBe(true);
    });

    test('should return false for non-existing secret', async () => {
      const secretManager = EnvSecretManager.getInstance();

      const exists = await secretManager.hasSecret('NON_EXISTING_SECRET');
      expect(exists).toBe(false);
    });

    test('should return false for empty secret', async () => {
      process.env.EMPTY_SECRET = '';
      const secretManager = EnvSecretManager.getInstance();

      const exists = await secretManager.hasSecret('EMPTY_SECRET');
      expect(exists).toBe(false);
    });

    test('should return false for whitespace-only secret', async () => {
      process.env.WHITESPACE_SECRET = '   ';
      const secretManager = EnvSecretManager.getInstance();

      const exists = await secretManager.hasSecret('WHITESPACE_SECRET');
      expect(exists).toBe(false);
    });
  });
});
