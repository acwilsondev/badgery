type NodeEnv = 'development' | 'staging' | 'production';

interface Config {
  nodeEnv: NodeEnv;
  port: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export class ConfigFactory {
  private static readonly defaults: Config = {
    nodeEnv: 'development',
    port: 3000,
    logLevel: 'debug'
  };

  private static validateNodeEnv(env: string | undefined): NodeEnv {
    const validEnvs: NodeEnv[] = ['development', 'staging', 'production'];
    const nodeEnv = (env ?? this.defaults.nodeEnv).toLowerCase() as NodeEnv;
    
    if (!validEnvs.includes(nodeEnv)) {
      throw new Error(`Invalid NODE_ENV: ${env}. Must be one of: ${validEnvs.join(', ')}`);
    }
    
    return nodeEnv;
  }

  private static validateLogLevel(level: string | undefined): Config['logLevel'] {
    const validLevels: Config['logLevel'][] = ['debug', 'info', 'warn', 'error'];
    const logLevel = (level ?? this.defaults.logLevel).toLowerCase() as Config['logLevel'];
    
    if (!validLevels.includes(logLevel)) {
      throw new Error(`Invalid LOG_LEVEL: ${level}. Must be one of: ${validLevels.join(', ')}`);
    }
    
    return logLevel;
  }

  public static createConfig(): Config {
    const nodeEnv = this.validateNodeEnv(process.env.NODE_ENV);
    const logLevel = this.validateLogLevel(process.env.LOG_LEVEL);
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : this.defaults.port;

    if (isNaN(port)) {
      throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number.`);
    }

    return {
      nodeEnv,
      port,
      logLevel
    };
  }
}
