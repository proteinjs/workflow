import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";
import { Type } from "./type";
import { Table } from "./table";
import { Server } from "./server";
import { ServiceLoader } from "./serviceLoader";
import { Service } from "./service";

export class Component extends Template {
  async generate(args: { 
    typeArgs: Parameters<Type['generate']>[0],
    tableArgs?: Omit<Parameters<Table['generate']>[0], 'name'> & { createTable: boolean, name?: string },
    serverArgs?: Parameters<Server['generate']>[0] & { createServer: boolean },
    serviceLoaderArgs?: Parameters<ServiceLoader['generate']>[0] & { createServiceLoader: boolean },
    serviceArgs?: Partial<Parameters<Service['generate']>[0]>,
  }): Promise<void> {
    const { typeArgs, tableArgs, serverArgs, serviceLoaderArgs, serviceArgs } = args;
    await new Type().generate(typeArgs);
    
    if (!tableArgs || tableArgs.createTable) {
      const ta = tableArgs ? tableArgs : {} as any;
      await new Table().generate({ 
        name: ta.name || typeArgs.name,
        columns: typeArgs.properties,
        ...ta 
      });
    }

    if (!serverArgs || serverArgs.createServer) {
      await new Server().generate({
        ...serverArgs 
      });
    }

    if (!serviceLoaderArgs || serviceLoaderArgs.createServiceLoader) {
      if (serviceArgs && serviceArgs.name && serviceArgs.functionBody) {
        await new Service().generate(serviceArgs as any);
      } else if (!tableArgs || tableArgs.createTable) {
        // table crud operation router
        const paragraph = new Paragraph();
        paragraph.add(new Sentence().add(`The service call function should expect the type of the request data to be of type { operation: 'create'|'read'|'update'|'delete', table: string, object: ${typeArgs.name} }`));
        paragraph.add(new Sentence().add(`The service call function should, depending on the operation, call the corresponding table crud function for the table specified, and pass in object`));
        paragraph.add(new Sentence().add(`The service call function should return the same type as the table crud function return type`));
        await new Service().generate({ name: typeArgs.name, functionBody: paragraph.toString() });
      }
    }
  }
}