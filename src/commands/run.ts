import { flags } from "@oclif/command";
import * as execa from "execa";

import BaseCommand from "../base-command";

export default class Run extends BaseCommand {
  static description = "Executes a db-migrate command";

  static flags = {
    help: flags.help({ char: "h" }),
    ...BaseCommand.getStandardFlags()
  };

  static args = [{ name: "command" }];

  async run() {
    const { args, flags } = this.parse(Run);
    const envResult = await this.getEnvironmentVariables(flags);

    const { stdout } = await execa("npx", ["db-migrate", args.command], {
      env: envResult.env,
      shell: true
    });

    console.info(stdout);
  }
}