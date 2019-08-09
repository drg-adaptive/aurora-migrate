import { flags } from "@oclif/command";
import * as execa from "execa";

import BaseCommand from "../base-command";

export default class Run extends BaseCommand {
  static description = "Executes a db-migrate command";

  static flags = {
    help: flags.help({ char: "h" }),
    ...BaseCommand.getStandardFlags()
  };

  static args = [
    {
      name: "command",
      description: "The command that will be passed on to db-migrate",
      example: "up"
    }
  ];

  async run() {
    const { args, flags } = this.parse(Run);
    const envResult = await this.getEnvironmentVariables(flags);

    const { stdout } = await execa(
      "node",
      ["./node_modules/.bin/db-migrate", args.command],
      {
        env: envResult.env,
        shell: true,
        cwd: process.cwd(),
        stdio: "inherit"
      }
    );

    console.info(stdout);
  }
}
