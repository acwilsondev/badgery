import { Logger, LogEntry, LogLevel, NodeEnv } from '../types';
import { EnvConfigManager } from '../config/EnvConfigManager';

/**
 * Console-based logger implementation
 * Supports different formats based on environment and configurable log levels
 */
export class ConsoleLogger implements Logger {
  private static instance: ConsoleLogger;
  private readonly logLevel: LogLevel;
  private readonly nodeEnv: NodeEnv;

  /** Priority order of log levels */
  private static readonly LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  /** ANSI color codes for different log levels */
  private static readonly COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m', // green
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
  };

  /** ANSI reset color code */
  private static readonly RESET_COLOR = '\x1b[0m';

  /**
   * Private constructor to enforce singleton pattern
   * Initializes logger with configuration from EnvConfigManager
   */
  private constructor() {
    const config = EnvConfigManager.getInstance().getConfig();
    this.logLevel = config.logLevel;
    this.nodeEnv = config.nodeEnv;
  }

  /**
   * Gets the singleton instance
   * @returns The ConsoleLogger instance
   */
  public static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }
    return ConsoleLogger.instance;
  }

  /**
   * Checks if a message at the given level should be logged
   * @param level Log level to check
   * @returns true if the message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return (
      ConsoleLogger.LOG_LEVEL_PRIORITY[level] >=
      ConsoleLogger.LOG_LEVEL_PRIORITY[this.logLevel]
    );
  }

  /**
   * Creates a structured log entry
   * @param level Log level
   * @param message Message to log
   * @param error Optional error object
   * @returns Structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      env: this.nodeEnv,
    };

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack || '',
      };
    }

    return entry;
  }

  /**
   * Formats a log entry for development environment with colors
   * @param entry Log entry to format
   * @returns Formatted log string with ANSI colors
   */
  private formatDevelopmentLog(entry: LogEntry): string {
    const color = ConsoleLogger.COLORS[entry.level];
    const reset = ConsoleLogger.RESET_COLOR;
    const level = entry.level.toUpperCase().padEnd(5);
    let output = `${color}${level}${reset} [${entry.timestamp}] ${entry.message}`;

    if (entry.error) {
      output += `\n${entry.error.message}\n${entry.error.stack}`;
    }

    return output;
  }

  /**
   * Formats a log entry based on environment
   * Development: Colored, human-readable format
   * Production/Staging: JSON format
   * @param entry Log entry to format
   * @returns Formatted log string
   */
  private formatLog(entry: LogEntry): string {
    if (this.nodeEnv === 'development') {
      return this.formatDevelopmentLog(entry);
    }
    return JSON.stringify(entry);
  }

  /**
   * Internal logging method
   * @param level Log level
   * @param message Message to log
   * @param error Optional error object
   */
  private log(level: LogLevel, message: string, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, error);
    console[level](this.formatLog(entry));
  }

  /** @inheritdoc */
  public debug(message: string, error?: Error): void {
    this.log('debug', message, error);
  }

  /** @inheritdoc */
  public info(message: string, error?: Error): void {
    this.log('info', message, error);
  }

  /** @inheritdoc */
  public warn(message: string, error?: Error): void {
    this.log('warn', message, error);
  }

  /** @inheritdoc */
  public error(message: string, error?: Error): void {
    this.log('error', message, error);
  }

  /**
   * Reset the singleton instance (for testing purposes only)
   * @internal
   */
  public static resetInstance(): void {
    ConsoleLogger.instance = undefined;
  }
}
