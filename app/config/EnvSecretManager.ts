import { SecretManager } from '../types';

/**
 * Environment-based secrets manager
 * Manages access to application secrets through environment variables
 */
export class EnvSecretManager implements SecretManager {
  /**
   * Retrieves a required secret value.
   * @param secretName - The name of the secret to retrieve
   * @param formatValidator - Optional regex pattern to validate the secret format
   * @throws Error if the secret is not found or fails validation
   * @returns The secret value
   */
  public async getSecret(
    secretName: string,
    formatValidator?: RegExp
  ): Promise<string> {
    const value = process.env[secretName]?.trim();

    if (!value) {
      throw new Error(`Required secret ${secretName} not found`);
    }

    if (formatValidator && !formatValidator.test(value)) {
      throw new Error(`Secret ${secretName} does not match required format`);
    }

    return value;
  }

  /**
   * Retrieves an optional secret value with a default fallback.
   * @param secretName - The name of the secret to retrieve
   * @param defaultValue - The default value to return if the secret is not found
   * @param formatValidator - Optional regex pattern to validate the secret format
   * @returns The secret value or the default value
   */
  public async getOptionalSecret(
    secretName: string,
    defaultValue: string,
    formatValidator?: RegExp
  ): Promise<string> {
    const value = process.env[secretName]?.trim();

    if (!value) {
      return defaultValue;
    }

    if (formatValidator && !formatValidator.test(value)) {
      throw new Error(`Secret ${secretName} does not match required format`);
    }

    return value;
  }

  /**
   * Checks if a secret exists
   * @param secretName - The name of the secret to check
   * @returns Promise resolving to true if the secret exists
   */
  public async hasSecret(secretName: string): Promise<boolean> {
    const value = process.env[secretName]?.trim();
    return value !== undefined && value !== '';
  }

  /**
   * Creates a singleton instance of EnvSecretManager
   * @returns The EnvSecretManager instance
   */
  public static getInstance(): EnvSecretManager {
    if (!EnvSecretManager.instance) {
      EnvSecretManager.instance = new EnvSecretManager();
    }
    return EnvSecretManager.instance;
  }

  private static instance: EnvSecretManager | null = null;

  /**
   * Private constructor to enforce singleton pattern
   * @throws Error if attempting to create a new instance when one already exists
   */
  private constructor() {
    // Before checking, store the current instance value
    const currentInstance = EnvSecretManager.instance;

    // Temporarily set this as the instance
    EnvSecretManager.instance = this;

    // Now check if there was a previous instance
    if (currentInstance) {
      // Restore the previous instance and throw
      EnvSecretManager.instance = currentInstance;
      throw new Error(
        'Use EnvSecretManager.getInstance() instead of new operator'
      );
    }
  }

  /**
   * Reset the singleton instance (for testing purposes only)
   * @internal
   */
  public static resetInstance(): void {
    EnvSecretManager.instance = null;
  }
}
