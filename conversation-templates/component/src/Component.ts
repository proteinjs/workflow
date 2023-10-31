// import { Template, TemplateArgs, Paragraph, Sentence } from '@brentbahry/conversation';
// import { Type, TypeArgs } from '@brentbahry/ts';
// import { Table, TableArgs } from '@brentbahry/table';
// import { Server, ServerArgs } from '@brentbahry/server';
// import { Service, ServiceArgs, ServiceLoaderArgs } from '@brentbahry/service';

// export type ComponentArgs = { 
//   typeArgs: TypeArgs,
//   tableArgs?: Omit<TableArgs, 'name'> & { createTable: boolean, name?: string },
//   serverArgs?: ServerArgs & { createServer: boolean },
//   serviceLoaderArgs?: ServiceLoaderArgs & { createServiceLoader: boolean },
//   serviceArgs?: Partial<ServiceArgs>,
// }

// export class Component extends Template {
//   private args: ComponentArgs;

//   constructor(args: ComponentArgs & TemplateArgs) {
//     super(args);
//     this.args = args;
//   }

//   files() {
//     return {
//       type: this.filePath(`${this.args.typeArgs.name}.ts`)
//     };
//   }

//   async generate(): Promise<void> {
//     const { typeArgs, tableArgs, serverArgs, serviceLoaderArgs, serviceArgs } = this.args;
//     await new Type({...typeArgs, ...this.templateArgs}).generate();
    
//     if (!tableArgs || tableArgs.createTable) {
//       const ta = tableArgs ? tableArgs : {} as any;
//       await new Table({ 
//         name: ta.name || typeArgs.name,
//         columns: typeArgs.properties,
//         ...ta,
//         ...this.templateArgs
//       }).generate();
//     }

//     if (!serverArgs || serverArgs.createServer) {
//       await new Server({
//         ...serverArgs,
//         ...this.templateArgs
//       }).generate();
//     }

//     if (!serviceLoaderArgs || serviceLoaderArgs.createServiceLoader) {
//       if (serviceArgs && serviceArgs.name && serviceArgs.functionBody) {
//         await new Service(serviceArgs as any).generate();
//       } else if (!tableArgs || tableArgs.createTable) {
//         // table crud operation router
//         const paragraph = new Paragraph();
//         paragraph.add(new Sentence().add(`The service call function should expect the type of the request data to be of type { operation: 'create'|'read'|'update'|'delete', table: string, object: ${typeArgs.name} }`));
//         paragraph.add(new Sentence().add(`The service call function should, depending on the operation, call the corresponding table crud function for the table specified, and pass in object`));
//         paragraph.add(new Sentence().add(`The service call function should return the same type as the table crud function return type`));
//         await new Service({ name: typeArgs.name, functionBody: paragraph.toString(), ...this.templateArgs }).generate();
//       }
//     }
//   }
// }