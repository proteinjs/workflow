export type LogLevel = 'debug'|'info'|'error';

export class Logger {
  private name?: string;
  private logLevel: LogLevel = 'info';

  constructor(name?: string, logLevel?: LogLevel) {
    this.name = name;
  }

  private prefix() {
    const timestamp = new Date().toLocaleString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    const namePrefix = this.name ? ` [${this.name}]` : '';
    return `${timestamp}${namePrefix}`;
  }

  log(message: string) {
    console.log(`${this.prefix()} ${message}`);
  }

  debug(message: string) {
    if (this.logLevel == 'info' || this.logLevel == 'error')
      return;

    console.debug(`${this.prefix()} ${message}`);
  }

  info(message: string) {
    if (this.logLevel == 'error')
      return;

    console.info(`${this.prefix()} ${message}`);
  }

  error(message: string) {
    console.error(`${this.prefix()} ${message}`);
  }
}