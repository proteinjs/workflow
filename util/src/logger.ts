export type LogLevel = 'debug'|'info'|'warn'|'error';

export class Logger {
  private name?: string;
  private logLevel: LogLevel;
  private limit: number;

  constructor(name?: string, logLevel: LogLevel = 'info', limit: number = 250) {
    this.name = name;
    this.logLevel = logLevel;
    this.limit = limit;
  }

  private prefix() {
    const timestamp = new Date().toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const namePrefix = this.name ? ` [${this.name}]` : '';
    return `${timestamp}${namePrefix}`;
  }

  log(message: string) {
    console.log(`${this.prefix()} ${this.limitMessageLength(message)}`);
  }

  debug(message: string) {
    if (this.logLevel == 'info' || this.logLevel == 'warn' || this.logLevel == 'error')
      return;

    console.debug(`${this.prefix()} ${this.limitMessageLength(message)}`);
  }

  info(message: string) {
    if (this.logLevel == 'warn' || this.logLevel == 'error')
      return;

    console.info(`${this.prefix()} ${this.limitMessageLength(message)}`);
  }

  warn(message: string) {
    if (this.logLevel == 'error')
      return;

    console.warn(`${this.prefix()} ${this.limitMessageLength(message)}`);
  }

  error(message: string) {
    console.error(`${this.prefix()} ${message}`);
  }

  private limitMessageLength(message: string) {
    if (message.length > this.limit)
      return message.slice(0, this.limit) + '...';

    return message;
  }
}