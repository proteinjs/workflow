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

  /**
   * @param packages packages to install
   * @param cwdPath directory to execute the command from
   */
  static async installPackages(packages: Package[], cwdPath?: string) {
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
      let envVars;
      if (cwdPath)
        envVars = { cwd: cwdPath }
      PackageUtil.LOGGER.info(`Running command: ${command}`);
      await cmd('npm', args, envVars);
      PackageUtil.LOGGER.info(`Ran command: ${command}`);
    }
  }

  static async runPackageScript(name: string, cwdPath?: string) {
    const args = [
      'run',
      name,
    ];
    const command = 'npm ' + args.join(' ');
    let envVars;
      if (cwdPath)
        envVars = { cwd: cwdPath }
    PackageUtil.LOGGER.info(`Running command: ${command}`);
    await cmd('npm', args, envVars);
    PackageUtil.LOGGER.info(`Ran command: ${command}`);
  }
}