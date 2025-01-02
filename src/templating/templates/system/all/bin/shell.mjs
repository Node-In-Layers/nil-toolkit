#!/usr/bin/env node

import esMain from 'es-main'
import { ArgumentParser } from 'argparse'
import repl from 'repl'
import chalk from 'chalk'
import merge from 'lodash/merge.js'
import * as core from '@node-in-layers/core'

const _parseArguments = () => {
  const parser = new ArgumentParser({
    description:
      'Starts a shell environment into the system.',
  })
  parser.add_argument('environment', {
    help: 'The environment for the service.',
  })
  return parser.parse_args()
}

const _systemStartup = async (environment) => {
  return core.loadSystem({
    environment,
  })
}


const main = async () => {
  const args = _parseArguments()
  const objects = await _systemStartup(args.environment)
  merge(repl.start().context, objects)

  console.info(chalk.blue.bold(`Welcome to the shell.`))
  console.info(chalk.blue.bold(`--------------------------------`))
  console.info(chalk.white.bold(`You have access to the following objects:`))
  console.info(
    chalk.white.bold(
      `[${Object.keys(objects).join(', ')}]`
      //`[ services, config, orm, ormQueryBuilder, models, datastoreProvider ]`
    )
  )
}

if (esMain(import.meta)) {
  main()
}

