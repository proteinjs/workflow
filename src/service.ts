import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";
import { ServiceLoader } from "./serviceLoader";

export class Service extends Template {
  async generate(args: {
    name: string,
    functionBody: string,
    path?: string,
    additionalInstructions?: string,
    serviceLoaderArgs?: Parameters<ServiceLoader['generate']>[0],
  }): Promise<void> {
    const { name, functionBody, path, serviceLoaderArgs, additionalInstructions } = args;
    await new ServiceLoader().generate({
      ...serviceLoaderArgs 
    });
    
    const paragraph = new Paragraph();
    paragraph.add(new Sentence().add(`Create a Service implementation named ${name}`));
    const resolvedPath = path ? path : 'the name of the service in lowercase';
    paragraph.add(new Sentence().add(`Set the path property of this service to ${resolvedPath}`));
    paragraph.add(new Sentence().add(functionBody));
    if (additionalInstructions)
      paragraph.add(new Sentence().add(additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      name: this.constructor.name,
      extension: 'ts',
      content: code  
    }]);
  }
}