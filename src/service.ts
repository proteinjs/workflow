import { Template } from "./util/template";
import { Paragraph } from "./util/paragraph";
import { Sentence } from "./util/sentence";
import { ServiceLoader, ServiceLoaderArgs } from "./serviceLoader";

export type ServiceArgs = {
  name: string,
  functionBody: string,
  path?: string,
  additionalInstructions?: string,
  serviceLoaderArgs?: ServiceLoaderArgs,
}

export class Service extends Template {
  private args: ServiceArgs;

  constructor(args: ServiceArgs) {
    super();
    this.args = Object.assign(args, { name: args.name.charAt(0).toUpperCase() + args.name.slice(1) });
  }

  files() {
    return {
      service: this.filePath(`${this.args.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { name, functionBody, path, serviceLoaderArgs, additionalInstructions } = this.args;
    await new ServiceLoader({
      ...serviceLoaderArgs 
    }).generate();
    
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
      relativePath: this.files().service,
      content: code  
    }]);
  }
}