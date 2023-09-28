import { Fs } from '@brentbahry/util';
import { Function } from '../../Function';

export const readFilesFunctionName = 'readFiles';
export const readFilesFunction: Function = {
  definition: {
    name: readFilesFunctionName,
    description: 'Get the content of files',
    parameters: {
      type: 'object',
      properties: {
        filePaths: {
          type: 'array',
          description: 'Paths to the files',
          items: {
            type: 'string',
          },
        },
      },
      required: ['filePaths']
    },
  },
  call: Fs.readFiles,
  instructions: [
    `To read files from the local file system, use the ${readFilesFunctionName} function`,
  ],
}

export const writeFilesFunctionName = 'writeFiles';
export const writeFilesFunction: Function = {
  definition: {
    name: writeFilesFunctionName,
    description: 'Write files to the file system',
    parameters: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          description: 'Files to write',
          items: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'the file path',
              },
              content: {
                type: 'string',
                description: 'the content to write to the file',
              },
            },
          },
        },
      },
      required: ['files']
    },
  },
  call: Fs.writeFiles,
  instructions: [
    `To write files to the local file system, use the ${writeFilesFunctionName} function`,
  ],
}

const createFolderFunctionName = 'createFolder';
const createFolderFunction: Function = {
  definition: {
    name: createFolderFunctionName,
    description: 'Create a folder/directory',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path of the new directory',
        },
      },
      required: ['path']
    },
  },
  call: async (params: { path: string }) => await Fs.createFolder(params.path),
  instructions: [
    `To create a folder on the local file system, use the ${createFolderFunctionName} function`,
  ],
}

export const fileOrDirectoryExistsFunctionName = 'fileOrDirectoryExists';
export const fileOrDirectoryExistsFunction: Function = {
  definition: {
    name: fileOrDirectoryExistsFunctionName,
    description: 'Check if a file or directory exists',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Path of the file or directory',
        },
      },
      required: ['path']
    },
  },
  call: async (params: { path: string }) => await Fs.exists(params.path),
  instructions: [
    `To check if a file or folder exists on the local file system, use the ${fileOrDirectoryExistsFunctionName} function`,
  ],
}

export const getFilePathsMatchingGlobFunctionName = 'getFilePathsMatchingGlob';
const getFilePathsMatchingGlobFunction: Function = {
  definition: {
    name: getFilePathsMatchingGlobFunctionName,
    description: 'Get file paths matching a glob',
    parameters: {
      type: 'object',
      properties: {
        dirPrefix: {
          type: 'string',
          description: 'Directory to recursively search for files',
        },
        glob: {
          type: 'string',
          description: 'File matching pattern',
        },
        globIgnorePatterns: {
          type: 'array',
          description: 'Directories to ignore',
          items: {
            type: 'string',
          },
        },
      },
      required: ['dirPrefix', 'glob']
    },
  },
  call: async (params: { dirPrefix: string, glob: string, globIgnorePatterns?: string[] }) => await Fs.getFilePathsMatchingGlob(params.dirPrefix, params.glob, params.globIgnorePatterns),
  instructions: [
    `To get file paths matching a glob, use the ${getFilePathsMatchingGlobFunctionName} function`,
  ],
}

export const renameFunctionName = 'renameFileOrDirectory';
const renameFunction: Function = {
  definition: {
    name: renameFunctionName,
    description: 'Rename a file or directory',
    parameters: {
      type: 'object',
      properties: {
        oldPath: {
          type: 'string',
          description: 'Original path of the file or directory',
        },
        newName: {
          type: 'string',
          description: 'New name for the file or directory',
        },
      },
      required: ['oldPath', 'newName']
    },
  },
  call: async (params: { oldPath: string, newName: string }) => await Fs.rename(params.oldPath, params.newName),
  instructions: [
    `To rename a file or directory, use the ${renameFunctionName} function`,
  ],
}

export const copyFunctionName = 'copyFileOrDirectory';
const copyFunction: Function = {
  definition: {
    name: copyFunctionName,
    description: 'Copy a file or directory',
    parameters: {
      type: 'object',
      properties: {
        sourcePath: {
          type: 'string',
          description: 'Path of the source file or directory',
        },
        destinationPath: {
          type: 'string',
          description: 'Destination path for the copied file or directory',
        },
      },
      required: ['sourcePath', 'destinationPath']
    },
  },
  call: async (params: { sourcePath: string, destinationPath: string }) => await Fs.copy(params.sourcePath, params.destinationPath),
  instructions: [
    `To copy a file or directory, use the ${copyFunctionName} function`,
  ],
}

export const moveFunctionName = 'moveFileOrDirectory';
const moveFunction: Function = {
  definition: {
    name: moveFunctionName,
    description: 'Move a file or directory',
    parameters: {
      type: 'object',
      properties: {
        sourcePath: {
          type: 'string',
          description: 'Path of the source file or directory',
        },
        destinationPath: {
          type: 'string',
          description: 'Destination path for the moved file or directory',
        },
      },
      required: ['sourcePath', 'destinationPath']
    },
  },
  call: async (params: { sourcePath: string, destinationPath: string }) => await Fs.move(params.sourcePath, params.destinationPath),
  instructions: [
    `To move a file or directory, use the ${moveFunctionName} function`,
  ],
}

export const fsFunctions: Function[] = [
  readFilesFunction,
  writeFilesFunction,
  createFolderFunction,
  fileOrDirectoryExistsFunction,
  getFilePathsMatchingGlobFunction,
  renameFunction,
  copyFunction,
  moveFunction,
]