import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";

// service interface and service loader
export class ServiceLoader extends Template {
  private static GENERATED = false;

  async generate(args: {
    additionalInstructions?: string,
  }): Promise<void> {
    if (ServiceLoader.GENERATED) {
      console.log(`Preventing duplicate generation of ${this.constructor.name}`);
      return;
    }

    const paragraph = new Paragraph();
    paragraph.add(new Sentence().add(`Create a Service interface that has the following properties: path: string, call: async function(requestData: any)`));
    paragraph.add(new Sentence().add(`Create a loadServices function that iterates through all Service implementations and registers them as routes with the server so that when a request comes in matching a service's path, its call function is invoked with the request data, and the output of the function is returned by the server as the response data`));
    paragraph.add(new Sentence().add(`Register the loadServices function with the server so it gets executed on server startup`));

    if (args.additionalInstructions)
      paragraph.add(new Sentence().add(args.additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      name: this.constructor.name,
      extension: 'ts',
      content: code  
    }]);
    ServiceLoader.GENERATED = true;
  }
}