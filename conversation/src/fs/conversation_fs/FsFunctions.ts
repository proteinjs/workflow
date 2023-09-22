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

export const fsFunctions: Function[] = [
  readFilesFunction,
  writeFilesFunction,
  createFolderFunction,
  fileOrDirectoryExistsFunction,
]