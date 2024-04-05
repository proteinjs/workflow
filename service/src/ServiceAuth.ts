import { Loadable, SourceRepository } from '@brentbahry/reflection'
import { Service } from './Service'

export const getServiceAuth = () => SourceRepository.get().object<ServiceAuth|undefined>('@proteinjs/service/ServiceAuth');

export abstract class ServiceAuth implements Loadable {
	abstract canRunService(service: Service): boolean;
}