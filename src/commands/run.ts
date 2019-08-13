import { flags } from "@oclif/command";
import * as execa from "execa";

import BaseCommand from "../base-command";

function updateOutput(
  ctx: { output: string },
  result: { exitCode: number; stdout: string; stderr: string },
  label?: string
) {
  if (result.exitCode !== 0) {
    throw new Error(result.stderr);
  }

  const prefix = `${label ? `[${label}] ` : ""}`;
  let lines = "";

  if (result && result.stdout) {
    lines =
      result.stdout
        .split("\n")
        .map(line => `${prefix}${line}`)
        .join("\n") + "\n";
  }

  ctx.output += lines;
}

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
    const ctx = { output: "" };

    this.log("Starting migration");

    await execa("./node_modules/.bin/db-migrate", args.command.split(" "), {
      env: envResult.env,
      shell: false,
      cwd: process.cwd()
    })
      .then(result => updateOutput(ctx, result, "db-migrate"))
      .catch(err => {
        throw err;
      });

    this.log(ctx.output);
  }
}
