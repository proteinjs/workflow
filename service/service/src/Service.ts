import { SerializableFunction, NotFunction } from '@proteinjs/serializer';
import { Loadable, SourceRepository } from '@brentbahry/reflection';
import { ServiceClient } from './ServiceClient';

export interface Service extends Loadable {
  /** If true, the user does not need to be logged in or have any roles to call this service. If blank, defaults to false. */
  public?: boolean;
  /** The user must be logged in and have these roles to call this service. If blank, defaults to requiring 'admin' role. */
  roles?: string[];
  [prop: string]: SerializableFunction | NotFunction<any>;
}

/**
 * Create a factory that creates an instance of the Service. The Service instance is a
 * ServiceClient wrapped in the interface's api.
 * @param serviceInterfaceQualifiedName the package-qualified name of the service interface (ie. @my-package/MyService)
 * @returns a function that creates a Service
 */
export const serviceFactory = (serviceInterfaceQualifiedName: string) => {
  return () => {
    const service: any = {};
    const serviceInterface = SourceRepository.get().interface(serviceInterfaceQualifiedName);
    for (let method of serviceInterface.methods) {
      const servicePath = `service/${serviceInterface.qualifiedName}/${method.name}`;
      const serviceClient = new ServiceClient(servicePath);
      service[method.name] = serviceClient.send.bind(serviceClient);
    }

    return service;
  }
}