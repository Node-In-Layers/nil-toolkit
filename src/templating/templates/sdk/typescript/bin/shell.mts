#!/usr/bin/env tsx

import esMain from 'es-main'
import { ArgumentParser } from 'argparse'
import repl from 'repl'
import chalk from 'chalk'
import merge from 'lodash/merge.js'
import { CoreNamespace, loadSystem, Config } from '@node-in-layers/core'
import { McpClientNamespace } from '@node-in-layers/mcp-client'
import { queryBuilder } from 'functional-models'
import { createClient } from '../src/client/entries.js'
import { create as createConfig } from '../src/config.js'
const _parseArguments = () => {
  const parser = new ArgumentParser({
    description: 'Starts a shell into the environment.',
  })
  parser.add_argument('environment', {
    help: 'The environment for the service.',
  })
  return parser.parse_args()
}

const help = objects => () => {
  console.info(chalk.white.bold(`You have access to the following objects:`))
  console.info(chalk.white.bold(`[${Object.keys(objects).join(', ')}]`))
  console.info()
  console.info(
    chalk.white.bold('You can also write "help()" to see this again.')
  )
}

const _loadConfig = async (environment: string) => {
  const filePath = `../config.${environment}.mts`
  const config = await (await import(filePath)).default()
  return createConfig(config)
}

const main = async () => {
  const args = _parseArguments()
  const config = await _loadConfig(args.environment)
  const client = await createClient(config)
  const system = await loadSystem({ 
    environment: args.environment,
    config: merge({}, config, {
      [CoreNamespace.root]: {
        apps: config[McpClientNamespace.client].domains,
      }
    }) as Config,
   })

  const context = repl.start().context
  merge(context, system, { client, queryBuilder })
  console.info(chalk.blue.bold(`Welcome to the shell.`))
  console.info(chalk.blue.bold(`--------------------------------`))
  const helpFunc = help({ ...system, system, client })
  helpFunc()
  context.help = helpFunc
}

if (esMain(import.meta)) {
  main()
}
