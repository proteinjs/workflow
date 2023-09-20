import { Logger } from '@brentbahry/util';
import { ConversationTemplate } from './ConversationTemplate';
import { createPackageConversationTemplate } from './createPackage/CreatePackageConversationTemplate';

const conversationTemplates: ConversationTemplate[] = [
  createPackageConversationTemplate,
];

export type ConversationTemplateRepoParams = {
  conversationTemplates: { [conversationTemplateName: string]: ConversationTemplate},
  conversationTemplateKeywordIndex: { [keyword: string]: string[] /** conversationTemplateNames */ }
}

export class ConversationTemplateRepo {
  private logger = new Logger(this.constructor.name);
  params: ConversationTemplateRepoParams;

  constructor(params: ConversationTemplateRepoParams) {
    this.params = params;
  }

  searchConversationTemplates(keyword: string) {
    this.logger.info(`Searching for conversation template, keyword: ${keyword}`);
    const conversationNames = this.params.conversationTemplateKeywordIndex[keyword];
    return conversationNames || [];
  }

  async getConversationTemplate(conversationTemplateName: string): Promise<Omit<ConversationTemplate, 'instructions'> & { instructions: string[] }> {
    const conversationTemplate = this.params.conversationTemplates[conversationTemplateName];
    if (!conversationTemplate)
      return {} as any;

    const instructions = await conversationTemplate.instructions();
    return Object.assign(conversationTemplate, { instructions });
  }

  getSystemMessages() {
    const instructions = [
      `Whenever the user wants to create or talk about something, use the searchConversationTemplates function to identify if there are relevant conversation templates to use`,
      `Use the getConversationTemplate function to get the conversation template`,
      `Once you've identified a conversation template that's relevant to the conversation, ask the user if they'd like to use that conversation template`,
      `If they want to engage in the templated conversation, ask the conversation template questions, then use the user's answers to carry out the conversation template instructions`,
    ];
    return [instructions.join('. ')];
  }
}

export class ConversationTemplateRepoFactory {
  create() {
    const params: ConversationTemplateRepoParams = { conversationTemplates: {}, conversationTemplateKeywordIndex: {} };
    for (let conversationTemplate of conversationTemplates) {
      params.conversationTemplates[conversationTemplate.name] = conversationTemplate;
      for (let keyword of conversationTemplate.keywords) {
        if (!params.conversationTemplateKeywordIndex[keyword])
          params.conversationTemplateKeywordIndex[keyword] = [];

        params.conversationTemplateKeywordIndex[keyword].push(conversationTemplate.name);
      }
    }

    return new ConversationTemplateRepo(params);
  }
}