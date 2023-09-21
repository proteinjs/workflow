import { Function } from './Function';
import { MessageModerator } from './history/MessageModerator';

export interface ConversationModule {
  getSystemMessages(): string[];
  getFunctions(): Function[];
  getMessageModerators(): MessageModerator[];
}