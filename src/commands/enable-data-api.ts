import { Command, flags } from "@oclif/command";
import * as AWS from "aws-sdk";
import * as Listr from "listr";
import * as Observable from "zen-observable";

import BaseCommand, {
  IFlagsContext,
  getStackDescription
} from "../base-command";

export default class EnableDataApi extends BaseCommand {
  static description = "describe the command here";

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    stack: flags.string({
      char: "s",
      required: true,
      description: "Name of the CloudFormation stack to reference"
    }),
    region: flags.string({
      required: true,
      env: "AWS_DEFAULT_REGION",
      default: "us-east-1",
      description: "The aws region to connect to"
    }),
    resource: flags.string({
      required: true,
      description:
        "Name of the stack output containing an ARN of the Aurora cluster"
    })
  };

  async run() {
    const { flags } = this.parse(EnableDataApi);

    const tasks = new Listr<IFlagsContext>([
      {
        title: `Get stack description`,
        task: getStackDescription
      },
      {
        title: "Enable data api",
        task: (ctx: IFlagsContext) =>
          new Observable(async (observer: SubscriptionObserver<T>) => {
            if (!ctx.outputs) return;

            observer.next("Find RDS Cluster ARN");
            const rds = new AWS.RDS({ region: ctx.flags.region });
            let output = ctx.outputs.find(
              (x: AWS.CloudFormation.Output) => x.OutputKey === flags.resource
            );

            if (!output) {
              throw new Error(
                `Could not find stack output "${flags.resource}"`
              );
            }

            let DBClusterIdentifier = output.OutputValue;

            if (!DBClusterIdentifier) {
              throw new Error(`The output "${flags.resource}" is empty`);
            }

            // Only the name of the cluster is used
            const parts = DBClusterIdentifier.split(":");
            DBClusterIdentifier = parts[parts.length - 1];

            observer.next("Update cluster");
            await rds
              .modifyDBCluster({
                EnableHttpEndpoint: true,
                DBClusterIdentifier
              })
              .promise();

            observer.complete();
          })
      }
    ]);

    const result = await tasks.run({ flags });
  }
}
