import { Fs } from '@brentbahry/util';
import { Function } from '../../Function';

export const readFilesFunction: Function = {
  definition: {
    name: 'readFiles',
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
}

export const writeFilesFunction: Function = {
  definition: {
    name: 'writeFiles',
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
  instructions: [],
}

const createFolderFunction: Function = {
  definition: {
    name: 'createFolder',
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
}

export const fileOrDirectoryExistsFunction: Function = {
  definition: {
    name: 'fileOrDirectoryExists',
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
}

export const fsFunctions: Function[] = [
  readFilesFunction,
  writeFilesFunction,
  createFolderFunction,
  fileOrDirectoryExistsFunction,
]