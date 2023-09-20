import { ConversationTemplateRepo } from '../conversation_templates/ConversationTemplateRepo';

export const searchConversationTemplatesFunction = (repo: ConversationTemplateRepo) => {
  return {
    definition: {
      name: 'searchConversationTemplates',
      description: 'Get the conversation template names for templates matching the keyword',
      parameters: {
        type: 'object',
        properties: {
          keyword: {
            type: 'string',
            description: 'Search for conversation template names that match this keyword',
          },
        },
        required: ['keyword']
      },
    },
    call: async (params: { keyword: string }) => repo.searchConversationTemplates(params.keyword),
  }
}

export const getConversationTemplateFunction = (repo: ConversationTemplateRepo) => {
  return {
    definition: {
      name: 'getConversationTemplate',
      description: 'Get the conversation template matching the name',
      parameters: {
        type: 'object',
        properties: {
          conversationTemplateName: {
            type: 'string',
            description: 'Get the conversation template that has this name',
          },
        },
        required: ['conversationTemplateName']
      },
    },
    call: async (params: { conversationTemplateName: string }) => repo.getConversationTemplate(params.conversationTemplateName),
  }
}