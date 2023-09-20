import { Repo } from '../Repo2'

export const searchFilesFunction = (repo: Repo) => {
  return {
    definition: {
      name: 'searchFiles',
      description: 'Get file paths to files that contain keyword',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Search files for this keyword'
          },
        },
        required: ['keyword']
      },
    },
    call: async (params: { keyword: string }) => repo.searchFiles(params),
    instructions: [
      `If the user is trying to interact with a file, but does not provide a path, you can find file paths that match a keyword using searchFiles`,
      `Only call functions that take in filePaths with valid file paths, if you don't know the valid file path try and search for it by keyword with the searchFiles function`,
      `If the user references a file in a package without providing a path, use searchFiles on the keyword to find potentially relevant files, and choose the one that references the package name in its path`,
    ],
  }
}

// {
      //   definition: {
      //     name: 'getDeclarations',
      //     description: 'Get the typescript declarations of files',
      //     parameters: {
      //       type: 'object',
      //       properties: {
      //         tsFilePaths: {
      //           type: 'array',
      //           description: 'Paths to the files',
      //           items: {
      //             type: 'string',
      //           },
      //         },
      //         includeDependencyDeclarations: {
      //           type: 'boolean',
      //           description: 'if true, returns declarations for input tsFilePaths and all dependencies. defaults to false.'
      //         },
      //       },
      //       required: ['tsFilePaths']
      //     },
      //   },
      //   call: async (params: { tsFilePaths: string[] }) => this.repo.getDeclarations(params),
      //   instructions: [
      //     `Favor calling getDeclarations over readFiles if full file content is not needed`,
      //   ],
      // },