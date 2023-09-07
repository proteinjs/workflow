export class Logger {
  private name?: string;

  constructor(name?: string) {
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
    console.debug(`${this.prefix()} ${message}`);
  }

  info(message: string) {
    console.info(`${this.prefix()} ${message}`);
  }

  error(message: string) {
    console.error(`${this.prefix()} ${message}`);
  }
}