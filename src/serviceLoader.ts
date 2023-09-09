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
      serviceLoader: this.filePath(`${this.constructor.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { additionalInstructions, serverArgs } = this.args;
    if (ServiceLoader.GENERATED) {
      this.logger.info(`Preventing duplicate generation of ${this.constructor.name}`);
      return;
    }

    await new Server({
      ...serverArgs 
    }).generate();

    const paragraph = new Paragraph();
    paragraph.add(new Sentence().add(`Create a Service interface that has the following properties: path: string, call: async function(requestData: any)`));
    paragraph.add(new Sentence().add(`Create a loadServices function that iterates through all Service implementations and registers them as routes with the server so that when a request comes in matching a service's path, its call function is invoked with the request data, and the output of the function is returned by the server as the response data`));
    paragraph.add(new Sentence().add(`Register the loadServices function with the server so it gets executed on server startup`));

    if (additionalInstructions)
      paragraph.add(new Sentence().add(additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      relativePath: this.files().serviceLoader,
      content: code  
    }]);
    ServiceLoader.GENERATED = true;
  }
}