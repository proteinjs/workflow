import { Template } from "./util/template";
import { Sentence } from "./util/sentence";
import { CodeGeneratorConfig } from "./util/CodeGeneratorConfig";

export class Type extends Template {
  async generate(args: { 
    name: string, 
    properties?: {[name: string]: string}
  }): Promise<void> {
    const { name, properties } = args;
    const sentence = new Sentence();
    sentence.add(`Create a type in ${CodeGeneratorConfig.get().language?.name} named ${name}`);
    if (args.properties)
      sentence.add(`with properties: ${JSON.stringify(properties)}`);

    const description = sentence.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{ 
      name: args.name,
      extension: 'ts',
      relativePath: this.constructor.name,
      content: code  
    }]);
  }
}