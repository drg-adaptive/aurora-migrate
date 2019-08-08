aurora-migrate
==============

Helper CLI to run db-migrate using cloudformation stacks

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/aurora-migrate.svg)](https://npmjs.org/package/aurora-migrate)
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
* [`aurora-migrate help [COMMAND]`](#aurora-migrate-help-command)
* [`aurora-migrate setup`](#aurora-migrate-setup)

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

## `aurora-migrate setup`

Generate a basic database.json that will connect to aurora

```
USAGE
  $ aurora-migrate setup

OPTIONS
  --file=file  [default: database.json]
```

_See code: [src/commands/setup.ts](https://github.com/drg-adaptive/aurora-migrate/blob/v0.0.0/src/commands/setup.ts)_
<!-- commandsstop -->
