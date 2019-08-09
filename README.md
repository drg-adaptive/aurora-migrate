aurora-migrate
==============

Helper CLI to run db-migrate using cloudformation stacks

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/aurora-migrate.svg)](https://npmjs.org/package/aurora-migrate)
[![Maintainability](https://api.codeclimate.com/v1/badges/59cee2af627f803aa839/maintainability)](https://codeclimate.com/github/drg-adaptive/aurora-migrate/maintainability)
[![Downloads/week](https://img.shields.io/npm/dw/aurora-migrate.svg)](https://npmjs.org/package/aurora-migrate)
[![License](https://img.shields.io/npm/l/aurora-migrate.svg)](https://github.com/drg-adaptive/aurora-migrate/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g aurora-migrate
$ aurora-migrate COMMAND
running command...
$ aurora-migrate (-v|--version|version)
aurora-migrate/0.0.0 darwin-x64 node-v10.16.0
$ aurora-migrate --help [COMMAND]
USAGE
  $ aurora-migrate COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [aurora-migrate](#aurora-migrate)
- [Usage](#usage)
- [Commands](#commands)
  - [`aurora-migrate help [COMMAND]`](#aurora-migrate-help-command)
  - [`aurora-migrate run [COMMAND]`](#aurora-migrate-run-command)
  - [`aurora-migrate setup`](#aurora-migrate-setup)

## `aurora-migrate help [COMMAND]`

display help for aurora-migrate

```
USAGE
  $ aurora-migrate help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `aurora-migrate run [COMMAND]`

Executes a db-migrate command

```
USAGE
  $ aurora-migrate run [COMMAND]

OPTIONS
  -h, --help           show CLI help
  -s, --stack=stack    (required) Name of the CloudFormation stack to reference
  --region=region      (required) [default: us-east-1] The aws region to connect to
  --resource=resource  (required) Name of the stack output containing an ARN of the Aurora cluster
  --secret=secret      (required) Name of the stack output containing an ARN of the secret store with RDS information
```

_See code: [src/commands/run.ts](https://github.com/drg-adaptive/aurora-migrate/blob/v0.0.0/src/commands/run.ts)_

## `aurora-migrate setup`

Generate a basic database.json that will connect to aurora

```
USAGE
  $ aurora-migrate setup

OPTIONS
  -e, --environment=environment  [default: prod] The name of the environment to create.
  --file=file                    [default: database.json] Where the config will be saved.
```

_See code: [src/commands/setup.ts](https://github.com/drg-adaptive/aurora-migrate/blob/v0.0.0/src/commands/setup.ts)_
<!-- commandsstop -->