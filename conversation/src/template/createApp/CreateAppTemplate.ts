import { ConversationTemplate, Question } from '../ConversationTemplate';

const createAppQuestions: Question[] = [
  {
    text: 'What is the name of the app you want to create?',
  },
  {
    text: 'Which directory would you like to create the app in? (if you give a relative path, it will be from the cwd; type cwd or pwd to get the current working directory)',
  },
];

const createAppInstructions = async () => {
  // Here we would implement the instructions based on the user's answers to the questions
  return [
    'cloneAppTemplatePackages',
    'update the package.json files of the packages you just cloned, set the package names to be app-name-ui and app-name-server',
    'npmInstall each newly cloned package',
    'runPackageScript(`build`, cwd) each newly cloned package',
    'describe the packages',
    'tell the user they can start the server by calling npm run dev in the server package',
  ];
};

export const createAppTemplate: ConversationTemplate = {
  name: 'Create App',
  keywords: ['create', 'app', 'create app', 'create new app'],
  description: 'This template will guide you through the process of creating a new app.',
  questions: createAppQuestions,
  instructions: createAppInstructions,
};