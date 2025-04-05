import { Config, ConfigManager, NodeEnv } from '../types';

/**
 * Environment-based configuration manager
 * Uses environment variables with fallback to default values
 */
export class EnvConfigManager implements ConfigManager {
  private static instance: EnvConfigManager;
  private currentConfig: Config;

  /** Default configuration values */
  private static readonly defaults: Config = {
    nodeEnv: 'development',
    port: 3000,
    logLevel: 'debug',
  };

  /**
   * Private constructor to enforce singleton pattern
   * Initializes configuration from environment
   */
  private constructor() {
    this.currentConfig = this.loadConfig();
  }

  /**
   * Gets the singleton instance
   * @returns The EnvConfigManager instance
   */
  public static getInstance(): EnvConfigManager {
    if (!EnvConfigManager.instance) {
      EnvConfigManager.instance = new EnvConfigManager();
    }
    return EnvConfigManager.instance;
  }

  /**
   * Get the current configuration
   * @returns Current config object
   */
  public getConfig(): Config {
    return { ...this.currentConfig };
  }

  /**
   * Reload configuration from environment
   */
  public async reload(): Promise<void> {
    this.currentConfig = this.loadConfig();
  }

  /**
   * Validate current configuration
   * @returns true if configuration is valid
   */
  public async validate(): Promise<boolean> {
    try {
      this.validateNodeEnv(this.currentConfig.nodeEnv);
      this.validateLogLevel(this.currentConfig.logLevel);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates and normalizes the NODE_ENV value
   * @param env Environment value to validate
   * @returns Validated NodeEnv value
   * @throws {Error} If the environment value is invalid
   */
  private validateNodeEnv(env: string | undefined): NodeEnv {
    const validEnvs: NodeEnv[] = ['development', 'staging', 'production'];
    const nodeEnv = (
      env ?? EnvConfigManager.defaults.nodeEnv
    ).toLowerCase() as NodeEnv;

    if (!validEnvs.includes(nodeEnv)) {
      throw new Error(
        `Invalid NODE_ENV: ${env}. Must be one of: ${validEnvs.join(', ')}`
      );
    }

    return nodeEnv;
  }

  /**
   * Validates and normalizes the LOG_LEVEL value
   * @param level Log level value to validate
   * @returns Validated log level value
   * @throws {Error} If the log level value is invalid
   */
  private validateLogLevel(level: string | undefined): Config['logLevel'] {
    const validLevels: Config['logLevel'][] = [
      'debug',
      'info',
      'warn',
      'error',
    ];
    const logLevel = (
      level ?? EnvConfigManager.defaults.logLevel
    ).toLowerCase() as Config['logLevel'];

    if (!validLevels.includes(logLevel)) {
      throw new Error(
        `Invalid LOG_LEVEL: ${level}. Must be one of: ${validLevels.join(', ')}`
      );
    }

    return logLevel;
  }

  /**
   * Load configuration from environment variables
   * @returns Validated configuration object
   * @throws {Error} If any configuration values are invalid
   */
  private loadConfig(): Config {
    const nodeEnv = this.validateNodeEnv(process.env.NODE_ENV);
    const logLevel = this.validateLogLevel(process.env.LOG_LEVEL);
    const port = process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : EnvConfigManager.defaults.port;

    if (isNaN(port)) {
      throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number.`);
    }

    return {
      nodeEnv,
      port,
      logLevel,
    };
  }

  /**
   * Reset the singleton instance (for testing purposes only)
   * @internal
   */
  public static resetInstance(): void {
    EnvConfigManager.instance = undefined;
  }
}
