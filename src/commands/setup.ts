import { Command, flags } from "@oclif/command";
import { cli } from "cli-ux";
import * as inquirer from "inquirer";
import * as fs from "fs";

export default class Setup extends Command {
  static description =
    "Generate a basic database.json that will connect to aurora";

  static flags = {
    file: flags.string({
      default: "database.json",
      description: "Where the config will be saved."
    }),
    environment: flags.string({
      char: "e",
      default: "prod",
      description: "The name of the environment to create."
    })
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Setup);
    const filename = flags.file;

    const environmentConfig = {
      driver: {
        require: "db-migrate-aurora"
      },
      database: { ENV: "AURORA_MIGRATE_DATABASE" },
      schema: { ENV: "AURORA_MIGRATE_SCHEMA" },
      secretArn: { ENV: "AURORA_MIGRATE_SECRET" },
      resourceArn: { ENV: "AURORA_MIGRATE_RESOURCE" },
      region: { ENV: "AURORA_MIGRATE_REGION" }
    };

    let config: { [key: string]: any } = {};

    if (fs.existsSync(filename)) {
      let oldConfig = JSON.parse(fs.readFileSync(filename, "utf-8"));

      let { overwrite, updateDefault } = await inquirer.prompt([
        {
          name: "overwrite",
          message: `${filename} already exists, overwrite?`,
          type: "confirm"
        },
        {
          name: "updateDefault",
          type: "confirm",
          when: (answers: any) =>
            !answers.overwrite &&
            oldConfig.defaultEnv &&
            oldConfig.defaultEnv !== flags.environment,
          message: `Change default environment from ${
            oldConfig.defaultEnv
          } to ${flags.environment}?`
        }
      ]);

      if (!overwrite) {
        config = oldConfig;
      }
      if (overwrite || updateDefault) {
        config.defaultEnv = flags.environment;
      }
    } else {
      config.defaultEnv = flags.environment;
    }

    config[flags.environment] = environmentConfig;

    cli.action.start(`Writing config to ${filename}`);

    fs.writeFileSync(filename, JSON.stringify(config, null, 2));

    cli.action.stop();
  }
}
