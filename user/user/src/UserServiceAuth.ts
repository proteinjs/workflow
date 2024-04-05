import { Service, ServiceAuth } from '@proteinjs/service';
import { Auth } from './Auth';

export class UserServiceAuth extends ServiceAuth {
  canRunService(service: Service): boolean {
    if (service.serviceMetadata?.auth?.public)
      return true;

    if (service.serviceMetadata?.auth?.allUsers)
      return Auth.isLoggedIn();

    if (!service.serviceMetadata?.auth?.roles)
      return Auth.hasRole('admin');

    return Auth.hasRoles(service.serviceMetadata.auth?.roles);
  }
}