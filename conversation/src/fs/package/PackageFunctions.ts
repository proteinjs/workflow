import { Package, PackageUtil } from '@brentbahry/util';
import { Function } from '../../Function';
import { PackageModule } from './PackageModule';

export const installPackagesFunction: Function = {
  definition: {
    name: 'installPackages',
    description: 'Get the content of files',
    parameters: {
      type: 'object',
      properties: {
        packages: {
          type: 'array',
          description: 'Packages to install',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of package',
              },
              version: {
                type: 'string',
                description: 'Version of package',
              },
              exactVersion: {
                type: 'boolean',
                description: 'If true, freeze the version so subsequent installs do not bump minor versions',
              },
              development: {
                type: 'boolean',
                description: 'If true, install as a dev dependency',
              },
            },
            required: ['name'],
          },
        },
        cwdPath: {
          type: 'string',
          description: 'If omitted, defaults to process.cwd',
        }
      },
      required: ['packages']
    },
  },
  call: async (params: { packages: Package[], cwdPath?: string }) => await PackageUtil.installPackages(params.packages, params.cwdPath),
  instructions: [
    `If the user wants to install a package, use the installPackages function`,
  ],
}

const runPackageScriptFunction: Function = {
  definition: {
    name: 'runPackageScript',
    description: 'Run `npm run x`, where `x` is an existing script in a package.json',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the script',
        },
        cwdPath: {
          type: 'string',
          description: 'If omitted, defaults to process.cwd',
        }
      },
      required: ['name']
    },
  },
  call: async (params: { name: string, cwdPath?: string }) => await PackageUtil.runPackageScript(params.name, params.cwdPath),
  instructions: [
    `If the user wants to run a npm script (such as start, test, or watch), use the runPackageScript function`,
  ],
}

export const searchPackagesFunctionName = 'searchPackages';
export function searchPackagesFunction(packageModule: PackageModule) {
  return {
    definition: {
      name: searchPackagesFunctionName,
      description: 'Get package.json file paths for package names that include the keyword',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Keyword to match package names',
          }
        },
        required: ['keyword']
      },
    },
    call: async (params: { keyword: string }) => await packageModule.searchPackages(params.keyword),
  }
}

export const searchLibrariesFunctionName = 'searchLibraries';
export function searchLibrariesFunction(packageModule: PackageModule) {
  return {
    definition: {
      name: searchLibrariesFunctionName,
      description: 'Return libraries that match the keyword',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Keyword to match file names',
          }
        },
        required: ['keyword']
      },
    },
    call: async (params: { keyword: string }) => await packageModule.searchLibraries(params.keyword),
  }
}

export const generateTypescriptDeclarationsFunction = {
  definition: {
    name: 'generateTypescriptDesclarations',
    description: 'Return the typescript declarations for the files',
    parameters: {
      type: 'object',
      properties: {
        tsFilePaths: {
          type: 'array',
          description: 'File paths to generate declarations for',
          items: {
            type: 'string',
          }
        }
      },
      required: ['tsFilePaths']
    },
  },
  call: async (params: { tsFilePaths: string[] }) => PackageUtil.generateTypescriptDeclarations(params),
}

export const packageFunctions: Function[] = [
  installPackagesFunction,
  runPackageScriptFunction,
  generateTypescriptDeclarationsFunction,
]