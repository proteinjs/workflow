import { Logger } from './Logger';
import { cmd } from './cmd';

export type Package = { 
  name: string, 
  version?: string, 
  exactVersion?: boolean, 
  development?: boolean 
}

export class PackageUtil {
  private static LOGGER = new Logger('PackageUtil');

  static async installPackages(packages: Package[]) {
    for (let backage of packages) {
      const { name, version, exactVersion, development } = backage;
      const resolvedExactVersion = typeof exactVersion === 'undefined' ? true : exactVersion;
      const resolvedDevelopment = typeof development === 'undefined' ? false : development;
      const args = [
        'i',
        `${resolvedDevelopment ? `-D` : resolvedExactVersion ? '--save-exact' : `-S`}`,
        `${name}${version ? `@${version}` : ''}`
      ];
      const command = 'npm ' + args.join(' ');
      PackageUtil.LOGGER.info(`Running command: ${command}`);
      await cmd('npm', args);
      PackageUtil.LOGGER.info(`Ran command: ${command}`);
    }
  }
}