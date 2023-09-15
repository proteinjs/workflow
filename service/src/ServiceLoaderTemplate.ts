import { Template, TemplateArgs, Paragraph, Sentence } from '@brentbahry/conversation';
import { ServerTemplate, ServerTemplateArgs } from '@brentbahry/server';

export type ServiceLoaderArgs = {
  additionalInstructions?: string,
  serverArgs?: ServerTemplateArgs,
}

// service interface and service loader
// TODO if serverArgs are not provided, import from @brentbahry/server
// TODO provide declarations instead of english to describe server api
//      get declarations from either the imported source or generated source
export class ServiceLoaderTemplate extends Template {
  private static GENERATED = false;
  private args: ServiceLoaderArgs;

  constructor(args: ServiceLoaderArgs & TemplateArgs) {
    super(args);
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
    if (ServiceLoaderTemplate.GENERATED) {
      this.logger.info(`Preventing duplicate generation of ${this.constructor.name}`);
      return;
    }

    if (serverArgs?.additionalInstructions) {
      await new ServerTemplate({
        ...serverArgs, ...this.templateArgs 
      }).generate();
    } else {

    }
    

    
    const serviceDescription = new Sentence().add(`Create ${this.apiDescriptions().service}`).toString();
    const serviceCode = await this.generateCode(serviceDescription);
    await this.writeFiles([{ 
      path: this.files().service,
      content: serviceCode  
    }]);

    const serviceLoaderDescription = new Paragraph();
    serviceLoaderDescription.add(new Sentence().add(`Assume ${this.apiDescriptions().service} already exists`));
    serviceLoaderDescription.add(new Sentence().add(`Import the Service interface from ${this.relativePath(this.files().serviceLoader, this.files().service)}`));
    serviceLoaderDescription.add(new Sentence().add(`Initialize a constant named services that is an array of Services`));
    serviceLoaderDescription.add(new Sentence().add(`Create and export a function named loadServices that iterates through all Services and registers them as routes with the ${ServerTemplate.FRAMEWORK} server so that when a request comes in matching a service's path, its call function is invoked with the request data, and the output of the function is written as a response to the request`));
    serviceLoaderDescription.add(new Sentence().add(`Let the catch block error param be of type any`));
    if (additionalInstructions)
      serviceLoaderDescription.add(new Sentence().add(additionalInstructions));

    const serviceLoaderCode = await this.generateCode(serviceLoaderDescription.toString());
    await this.writeFiles([{ 
      path: this.files().serviceLoader,
      content: serviceLoaderCode  
    }]);

    const serverUpdateDescription = new Paragraph()
      .add(new Sentence().add(`Import loadServices from ${this.relativePath(server.files().server, this.files().serviceLoader)}`))
      .add(new Sentence().add(`Register loadServices to be called on startup before app.listen and pass in the app to register the routes`))
    .toString();
    const serverUpdateCode = await this.updateCode(server.files().server, [this.files().serviceLoader], serverUpdateDescription, 'gpt-4');
    await this.writeFiles([{ 
      path: server.files().server,
      content: serverUpdateCode  
    }]);
    ServiceLoaderTemplate.GENERATED = true;
  }
}