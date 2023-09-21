import { ConversationModule } from '../../ConversationModule';
import { Function } from '../../Function';
import { packageFunctions } from './PackageFunctions';

export class PackageModule implements ConversationModule {
  getSystemMessages(): string[] {
    return [];
  }

  getFunctions(): Function[] {
    return packageFunctions;
  }

  getMessageModerators() {
    return [];
  }
}