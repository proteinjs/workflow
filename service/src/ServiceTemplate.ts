import { Template, TemplateArgs, Paragraph, Sentence } from '@brentbahry/conversation';
import { ServiceLoaderTemplate, ServiceLoaderArgs } from './ServiceLoaderTemplate';

export type ServiceArgs = {
  name: string,
  functionBody: string,
  parameters?: any,
  returnType?: any,
  path?: string,
  additionalInstructions?: string,
  serviceLoaderArgs?: ServiceLoaderArgs,
}

export class ServiceTemplate extends Template {
  private args: ServiceArgs;

  constructor(args: ServiceArgs & TemplateArgs) {
    super(args);
    this.args = Object.assign(args, { name: args.name.charAt(0).toUpperCase() + args.name.slice(1) });
  }

  files() {
    return {
      service: this.filePath(`${this.args.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { name, functionBody, parameters, returnType, serviceLoaderArgs, additionalInstructions } = this.args;
    const serviceLoader = new ServiceLoaderTemplate({
      ...serviceLoaderArgs, ...this.templateArgs
    });
    await serviceLoader.generate();
    
    const paragraph = new Paragraph();
    paragraph.add(new Sentence().add(`Assume ${serviceLoader.apiDescriptions().service} already exists`));
    paragraph.add(new Sentence().add(`Import the Service interface from ${this.relativePath(this.files().service, serviceLoader.files().service)}`));
    paragraph.add(new Sentence().add(`Create a Service implementation named ${name}`));
    const resolvedPath = this.args.path ? this.args.path : 'the name of the service in lowercase';
    paragraph.add(new Sentence().add(`Set the path property of this service to /${resolvedPath}`));
    if (parameters)
      paragraph.add(new Sentence().add(`The call function should have the following parameters: ${JSON.stringify(parameters)}`));
    
    if (returnType)
      paragraph.add(new Sentence().add(`The call function should have a return type of: ${JSON.stringify(returnType)}`));
    
    paragraph.add(new Sentence().add(`The call function should have the following implementation: ${functionBody}`));
    if (additionalInstructions)
      paragraph.add(new Sentence().add(additionalInstructions));

    const description = paragraph.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      path: this.files().service,
      content: code  
    }]);

    const serviceLoaderUpdateDescription = new Paragraph()
      .add(new Sentence().add(`Import ${name} from ${this.relativePath(serviceLoader.files().serviceLoader, this.files().service)}`))
      .add(new Sentence().add(`Add ${name} to the services array`))
    .toString();
    const serviceLoaderUpdateCode = await this.updateCode(serviceLoader.files().serviceLoader, [this.files().service], serviceLoaderUpdateDescription);
    await this.writeFiles([{ 
      path: serviceLoader.files().serviceLoader,
      content: serviceLoaderUpdateCode  
    }]);
  }
}