export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class Logger {
  constructor(private readonly context: string) {}

  debug(message: string): void {
    this.write('DEBUG', message);
  }

  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string, error?: unknown): void {
    const detail = error instanceof Error ? ` | ${error.stack ?? error.message}` : '';
    this.write('ERROR', `${message}${detail}`);
  }

  private write(level: Uppercase<LogLevel>, message: string): void {
    console.log(`${new Date().toISOString()} [${level}] [${this.context}] ${message}`);
  }
}
