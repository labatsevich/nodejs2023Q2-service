import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { appendFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor() {
    super();
  }

  error(message: any, stack?: string, context?: string): void {
    super.error(message, stack, context);
    this.write('error', message);
  }

  warn(message: any, context?: string): void {
    super.warn(message, context);
    this.write('warn', message);
  }

  log(message: any, context?: string): void {
    super.log(message, context);
    this.write('log', message);
  }

  verbose(message: any, context?: string): void {
    super.verbose(message, context);
    this.write('verbose', message);
  }

  debug(message: any, context?: string): void {
    super.debug(message, context);
    this.write('debug', context);
  }

  private write(level: LogLevel, message: string) {
    appendFileSync(join(process.cwd(), 'logs.log'), `${level} ${message}`);
  }
}
