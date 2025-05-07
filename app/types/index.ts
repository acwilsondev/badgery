/** Valid Node environment values */
export type NodeEnv = 'development' | 'staging' | 'production';

/** Valid log levels */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** Configuration interface for the application */
export interface Config {
  /** Current environment (development, staging, production) */
  nodeEnv: NodeEnv;
  /** Port number for the server to listen on */
  port: number;
  /** Minimum log level to output */
  logLevel: LogLevel;
}

/** Configuration manager interface */
export interface ConfigManager {
  /** Get the current configuration */
  getConfig(): Config;
  /** Reload configuration from source */
  reload(): Promise<void>;
  /** Validate current configuration */
  validate(): Promise<boolean>;
}

/** Secret manager interface */
export interface SecretManager {
  /** Get a required secret value */
  getSecret(key: string, formatValidator?: RegExp): Promise<string>;
  /** Get an optional secret value with default */
  getOptionalSecret(
    key: string,
    defaultValue: string,
    formatValidator?: RegExp
  ): Promise<string>;
  /** Check if a secret exists */
  hasSecret(key: string): Promise<boolean>;
}

/** Logger interface */
export interface Logger {
  /** Log a debug message */
  debug(message: string, error?: Error): void;
  /** Log an info message */
  info(message: string, error?: Error): void;
  /** Log a warning message */
  warn(message: string, error?: Error): void;
  /** Log an error message */
  error(message: string, error?: Error): void;
}

/** Structure of a log entry */
export interface LogEntry {
  /** ISO timestamp of when the log was created */
  timestamp: string;
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Current environment */
  env: string;
  /** Optional error information */
  error?: {
    /** Error message */
    message: string;
    /** Error stack trace */
    stack: string;
  };
}
