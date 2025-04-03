/**
 * Manages access to application secrets with validation and type safety.
 */
export class SecretManager {
  /**
   * Retrieves a required secret value.
   * @param secretName - The name of the secret to retrieve
   * @param formatValidator - Optional regex pattern to validate the secret format
   * @throws Error if the secret is not found or fails validation
   * @returns The secret value
   */
  public getSecret(secretName: string, formatValidator?: RegExp): string {
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
  public getOptionalSecret(
    secretName: string,
    defaultValue: string,
    formatValidator?: RegExp
  ): string {
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
   * Creates a singleton instance of SecretManager
   * @returns A SecretManager instance
   */
  public static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  private static instance: SecretManager | null = null;

  /**
   * Private constructor to enforce singleton pattern
   * @throws Error if attempting to create a new instance when one already exists
   */
  private constructor() {
    // Before checking, store the current instance value
    const currentInstance = SecretManager.instance;
    
    // Temporarily set this as the instance
    SecretManager.instance = this;
    
    // Now check if there was a previous instance
    if (currentInstance) {
      // Restore the previous instance and throw
      SecretManager.instance = currentInstance;
      throw new Error("Use SecretManager.getInstance() instead of new operator");
    }
  }

  /**
   * Reset the singleton instance (for testing purposes only)
   * @internal
   */
  public static resetInstance(): void {
    SecretManager.instance = null;
  }
}
