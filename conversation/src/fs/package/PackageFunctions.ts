import { Package, PackageUtil } from '@brentbahry/util';
import { Function } from '../../Function';

const installPackagesFunction: Function = {
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
    `If generating code and adding an import statement to a module that is not local to the package we're generating code in, read the package.json dependencies for the package you're generating code in; if the dependency is missing, install it with the installPackages function`,
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

export const packageFunctions: Function[] = [
  installPackagesFunction,
  runPackageScriptFunction,
]