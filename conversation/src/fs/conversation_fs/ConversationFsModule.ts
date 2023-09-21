import { ConversationModule } from '../../ConversationModule';
import { Function } from '../../Function';
import { ConversationFsModerator } from './ConversationFsModerator';
import { fsFunctions } from './FsFunctions';

export class ConversationFsModule implements ConversationModule {
  getSystemMessages(): string[] {
    return [];
  }

  getFunctions(): Function[] {
    return fsFunctions;
  }

  getMessageModerators() {
    return [
      new ConversationFsModerator(),
    ];
  }
}