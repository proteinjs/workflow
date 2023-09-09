import { Template } from "./util/template";
import { Sentence } from "./util/sentence";
import { CodeGeneratorConfig } from "./util/CodeGeneratorConfig";

export type TypeArgs = {
  name: string,
  properties?: {[name: string]: string}
}

export class Type extends Template {
  private args: TypeArgs;

  constructor(args: TypeArgs) {
    super();
    this.args = Object.assign(args, { name: args.name.charAt(0).toUpperCase() + args.name.slice(1) });
  }

  files() {
    return {
      type: this.filePath(`${this.args.name}.ts`)
    };
  }

  async generate(): Promise<void> {
    const { name, properties } = this.args;
    const sentence = new Sentence();
    sentence.add(`Create a type in ${CodeGeneratorConfig.get().language?.name} named ${name}`);
    if (properties)
      sentence.add(`with properties: ${JSON.stringify(properties)}`);

    const description = sentence.toString();
    const code = await this.generateCode(description);
    await this.writeFiles([{
      relativePath: this.files().type,
      content: code  
    }]);
  }
}