import { ConfigFactory } from '../config/ConfigFactory';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type NodeEnv = 'development' | 'staging' | 'production';
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  env: string;
  error?: {
    message: string;
    stack: string;
  };
}

export class LoggerFactory {
  private static instance: LoggerFactory;
  private readonly logLevel: LogLevel;
  private readonly nodeEnv: NodeEnv;
  
  private static readonly LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  private static readonly COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m', // cyan
    info: '\x1b[32m',  // green
    warn: '\x1b[33m',  // yellow
    error: '\x1b[31m'  // red
  };

  private static readonly RESET_COLOR = '\x1b[0m';
  private constructor() {
    const config = ConfigFactory.createConfig();
    this.logLevel = config.logLevel;
    this.nodeEnv = config.nodeEnv as NodeEnv;
  }

  public static getInstance(): LoggerFactory {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerFactory();
    }
    return LoggerFactory.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return LoggerFactory.LOG_LEVEL_PRIORITY[level] >= LoggerFactory.LOG_LEVEL_PRIORITY[this.logLevel];
  }

  private createLogEntry(level: LogLevel, message: string, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      env: this.nodeEnv
    };

    if (error) {
      entry.error = {
        message: error.message,
        stack: error.stack || ''
      };
    }

    return entry;
  }

  private formatDevelopmentLog(entry: LogEntry): string {
    const color = LoggerFactory.COLORS[entry.level];
    const reset = LoggerFactory.RESET_COLOR;
    const level = entry.level.toUpperCase().padEnd(5);
    let output = `${color}${level}${reset} [${entry.timestamp}] ${entry.message}`;
    
    if (entry.error) {
      output += `\n${entry.error.message}\n${entry.error.stack}`;
    }
    
    return output;
  }

  private formatLog(entry: LogEntry): string {
    if (this.nodeEnv === 'development') {
      return this.formatDevelopmentLog(entry);
    }
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, error);
    console[level](this.formatLog(entry));
  }

  public debug(message: string, error?: Error): void {
    this.log('debug', message, error);
  }

  public info(message: string, error?: Error): void {
    this.log('info', message, error);
  }

  public warn(message: string, error?: Error): void {
    this.log('warn', message, error);
  }

  public error(message: string, error?: Error): void {
    this.log('error', message, error);
  }
}
