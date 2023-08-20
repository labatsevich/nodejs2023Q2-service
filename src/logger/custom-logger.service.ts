import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { EOL } from 'os';
import { join } from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private level: number;
  private logLevels: string[];
  private logsFolder: string;
  private logFilePath: string;
  private errFilePath: string;
  private limitFileSize: number;

  constructor() {
    super();
    const logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    this.level = +process.env.LEVEL || 2;
    this.setLogLevels(logLevels.slice(0, this.level + 1));
    this.limitFileSize = +process.env.LOG_SIZE_LIMIT_KB * 1024 || 10 * 1024;
    this.logsFolder = join(process.cwd(), 'logs');
    this.logFilePath = '';
    this.errFilePath = '';
    this.init();
  }

  private init() {
    if (!this.folderExist(this.logsFolder)) {
      mkdirSync(this.logsFolder);
    }
  }

  error(message: any, stack?: string, context?: string): void {
    if (this.options.logLevels.includes('error')) {
      super.error(message, stack, context);
      this.write('error', `${message} ${EOL}`);
    }
  }

  warn(message: any, context?: string): void {
    if (this.options.logLevels.includes('warn')) {
      super.warn(message, context);
    }
  }

  log(message: any, context?: string): void {
    if (this.options.logLevels.includes('log')) {
      super.log(message, context);
      this.write('log', `${message} ${EOL}`);
    }
  }

  debug(message: any, context?: string): void {
    if (this.options.logLevels.includes('debug')) {
      super.debug(message, context);
    }
  }

  async verbose(message: any, context?: string): Promise<void> {
    if (this.options.logLevels.includes('verbose')) {
      super.verbose(message, context);
    }
  }

  private write(level: LogLevel, message: string) {
    if (!this.options.logLevels.includes(level)) return;
    const timestamp = new Date().toLocaleString();
    const filePath = this[`${level}FilePath`];

    if (existsSync(filePath)) {
      const { size } = statSync(filePath);

      if (size < this.limitFileSize) {
        appendFileSync(filePath, `${timestamp} - [${level}]: ${message}`);
      } else {
        this[`${level}FilePath`] = join(
          this.logsFolder,
          `${new Date().toISOString()}-${level}.log`,
        );
        writeFileSync(this[`${level}FilePath`], message, 'utf-8');
      }
    } else {
      this[`${level}FilePath`] = join(
        this.logsFolder,
        `${new Date().toISOString()}-${level}.log`,
      );
      writeFileSync(this[`${level}FilePath`], message, 'utf-8');
    }
  }

  private folderExist(dirPath: string): boolean {
    return existsSync(dirPath);
  }
}
