import { Logger } from './Logger';
import { cmd } from './cmd';

export class GitUtil {
  private static LOGGER = new Logger('GitUtil');

  static async cloneAppTemplatePackages(directory: string): Promise<void> {
    const args = ['clone', 'https://github.com/brentbahry/app-template.git', directory];
    const command = 'git ' + args.join(' ');
    let envVars;
    if (directory)
      envVars = { cwd: directory }
    GitUtil.LOGGER.info(`Running command: ${command}`);
    await cmd('git', args, envVars);
    GitUtil.LOGGER.info(`Ran command: ${command}`);
  }
}

export const cloneAppTemplatePackagesFunctionName = 'cloneAppTemplatePackages';
export const cloneAppTemplatePackagesFunction = {
  definition: {
    name: cloneAppTemplatePackagesFunctionName,
    description: 'Clone the app template packages to the specified directory',
    parameters: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          description: 'The directory to clone the packages to',
        },
      },
      required: ['directory']
    },
  },
  call: async (params: { directory: string }) => await GitUtil.cloneAppTemplatePackages(params.directory),
}
