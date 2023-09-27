import { cmd } from './cmd';

export class GitUtil {
  static async cloneAppTemplatePackages(directory: string): Promise<void> {
    await cmd(`git clone https://github.com/brentbahry/app-template.git ${directory}`);
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
