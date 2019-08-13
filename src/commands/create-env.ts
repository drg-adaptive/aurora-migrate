import { flags } from "@oclif/command";
import * as fs from "fs";
import * as path from "path";

import BaseCommand from "../base-command";

export default class CreateEnv extends BaseCommand {
  static description = "Create a .env file in the current directory";

  static flags = {
    help: flags.help({ char: "h" }),
    ...BaseCommand.getStandardFlags()
  };

  static args = [{ name: "file", default: path.join(process.cwd(), ".env") }];

  createEnv(value: { [key: string]: string | undefined }): string {
    return Object.keys(value)
      .map((key: string) => `${key}=${value[key]}`)
      .join("\n");
  }

  async run() {
    const { args, flags } = this.parse(CreateEnv);
    const envResult = await this.getEnvironmentVariables(flags);

    if (envResult.env) {
      fs.writeFileSync(path.resolve(args.file), this.createEnv(envResult.env));
    }
  }
}
