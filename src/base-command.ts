import { Command, flags } from "@oclif/command";
import * as AWS from "aws-sdk";
import * as Listr from "listr";

interface ITaskContext {
  flags: {
    stack: string;
    region: string;
    database?: string;
    schema?: string;
  };
  outputs: Array<AWS.CloudFormation.Output>;
  secretName: string;
  resourceName: string;
  secretArn?: string;
  resourceArn?: string;
  env?: { [key: string]: string | undefined };
  [key: string]: any;
}

async function getStackOutput(
  ctx: ITaskContext
): Promise<Array<AWS.CloudFormation.Output>> {
  const cloudformation = new AWS.CloudFormation({
    apiVersion: "2010-05-15",
    region: ctx.flags.region
  });

  const data = await cloudformation
    .describeStacks({
      StackName: ctx.flags.stack
    })
    .promise();

  if (!data || !data.Stacks)
    throw Error(`Error getting data for stack ${ctx.flags.stack}`);

  return data.Stacks.reduce(
    (
      result: Array<AWS.CloudFormation.Output>,
      current: AWS.CloudFormation.Stack
    ) => {
      if (!current.Outputs) return result;

      return [...result, ...current.Outputs];
    },
    []
  );
}

const getCloudFormationParams = new Listr<ITaskContext>(
  [
    {
      title: `Get stack description`,
      async task(ctx: ITaskContext) {
        ctx.outputs = await getStackOutput(ctx);
      }
    },
    {
      title: `Get outputs`,
      task(ctx: ITaskContext) {
        return new Listr(
          ["secretArn", "resourceArn"].map((key: string) => {
            const outputName = ctx[key.replace("Arn", "Name")];
            return {
              title: `Getting "${outputName}`,
              task() {
                const output = ctx.outputs.find(
                  (x: AWS.CloudFormation.Output) => x.OutputKey === outputName
                );

                if (!output)
                  throw new Error(
                    `Could not find output ${outputName} in ${ctx.stack}`
                  );

                if (!output.OutputValue)
                  throw new Error(
                    `No value set for ${outputName} in ${ctx.stack}`
                  );

                ctx[key] = output.OutputValue;
              }
            };
          }),
          { concurrent: true }
        );
      }
    },
    {
      title: `Get secret values`,
      skip: (ctx: ITaskContext) => ctx.flags.database && ctx.flags.schema,
      async task(ctx: ITaskContext) {
        const dbname = ctx.flags.database || ctx.flags.schema;

        if (dbname) {
          ctx.flags.database = dbname;
          ctx.flags.schema = dbname;
          return;
        }

        const secretsManager = new AWS.SecretsManager({
          apiVersion: "2017-10-17",
          region: ctx.flags.region
        });

        if (!ctx.secretArn) {
          throw new Error("No secret ARN found!");
        }
        const secret = await secretsManager
          .getSecretValue({ SecretId: ctx.secretArn })
          .promise();

        if (!secret.SecretString) {
          throw new Error("Could not load secret data");
        }

        const secretContent = JSON.parse(secret.SecretString);

        ctx.flags.database = ctx.flags.database || secretContent.dbname;
        ctx.flags.schema = ctx.flags.schema || secretContent.dbname;
      }
    },
    {
      title: `Set environment variables`,
      task(ctx: ITaskContext) {
        ctx.env = {
          AURORA_MIGRATE_DATABASE: ctx.flags.database,
          AURORA_MIGRATE_SCHEMA: ctx.flags.schema,
          AURORA_MIGRATE_SECRET: ctx.secretArn,
          AURORA_MIGRATE_RESOURCE: ctx.resourceArn,
          AURORA_MIGRATE_REGION: ctx.flags.region
        };
      }
    }
  ],
  { concurrent: false }
);

export default abstract class BaseCommand extends Command {
  static getStandardFlags(): { [key: string]: flags.IOptionFlag<any> } {
    return {
      stack: flags.string({
        char: "s",
        required: true,
        description: "Name of the CloudFormation stack to reference"
      }),
      secret: flags.string({
        required: true,
        description:
          "Name of the stack output containing an ARN of the secret store with RDS information"
      }),
      resource: flags.string({
        required: true,
        description:
          "Name of the stack output containing an ARN of the Aurora cluster"
      }),
      region: flags.string({
        required: true,
        env: "AWS_DEFAULT_REGION",
        default: "us-east-1",
        description: "The aws region to connect to"
      }),
      database: flags.string({
        required: false,
        description: "Database in the cluster to connect to"
      }),
      schema: flags.string({
        required: false,
        description: "Schema in the database to run operations on"
      })
    };
  }

  protected async getEnvironmentVariables(flags: any) {
    return getCloudFormationParams.run({
      flags,
      resourceName: flags.resource,
      secretName: flags.secret,
      outputs: []
    });
  }
}
