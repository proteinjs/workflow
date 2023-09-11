import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";
import { Server, ServerArgs } from './server';

export type ServiceLoaderArgs = {
  additionalInstructions?: string,
  serverArgs?: ServerArgs,
}

// service interface and service loader
export class ServiceLoader extends Template {
  private static GENERATED = false;
  private args: ServiceLoaderArgs;

  constructor(args: ServiceLoaderArgs) {
    super();
    this.args = args;
  }

  files() {
    return {
      service: this.filePath(`Service.ts`),
      serviceLoader: this.filePath(`${this.constructor.name}.ts`)
    };
  }

  apiDescriptions() {
    return {
      service: `an interface named Service that has the following properties: path: string, call: async function(args: any): Promise<any>`,
    };
  }

  async generate(): Promise<void> {
    const { additionalInstructions, serverArgs } = this.args;
    if (ServiceLoader.GENERATED) {
      this.logger.info(`Preventing duplicate generation of ${this.constructor.name}`);
      return;
    }

    const server = new Server({
      ...serverArgs 
    });
    await server.generate();

    
    const serviceDescription = new Sentence().add(`Create ${this.apiDescriptions().service}`).toString();
    const serviceCode = await this.generateCode(serviceDescription);
    await this.writeFiles([{ 
      path: this.files().service,
      content: serviceCode  
    }]);

    let serviceLoaderDescription = new Sentence().add(`Assume ${this.apiDescriptions().service} already exists`).toString();
    serviceLoaderDescription += new Sentence().add(`Import the Service interface from ${this.relativePath(this.files().serviceLoader, this.files().service)}`).toString();
    serviceLoaderDescription += new Sentence().add(`Initialize a constant named services that is an array of Services`).toString();
    serviceLoaderDescription += new Sentence().add(`Create and export a function named loadServices that iterates through all Services and registers them as routes with the ${server.framework} server so that when a request comes in matching a service's path, its call function is invoked with the request data, and the output of the function is written as a response to the request`).toString();
    serviceLoaderDescription += new Sentence().add(`Let the catch block error param be of type any`).toString();
    if (additionalInstructions)
      serviceLoaderDescription += new Sentence().add(additionalInstructions).toString();

    const serviceLoaderCode = await this.generateCode(serviceLoaderDescription);
    await this.writeFiles([{ 
      path: this.files().serviceLoader,
      content: serviceLoaderCode  
    }]);

    const serverUpdateDescription = new Paragraph()
      .add(new Sentence().add(`Import loadServices from ${this.relativePath(server.files().server, this.files().serviceLoader)}`))
      .add(new Sentence().add(`Register loadServices to be called on startup before app.listen and pass in the app to register the routes`))
    .toString();
    const serverUpdateCode = await this.updateCode(server.files().server, [this.files().serviceLoader], serverUpdateDescription);
    await this.writeFiles([{ 
      path: server.files().server,
      content: serverUpdateCode  
    }]);
    ServiceLoader.GENERATED = true;
  }
}