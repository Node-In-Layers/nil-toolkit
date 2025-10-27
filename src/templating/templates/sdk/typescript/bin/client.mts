#!/usr/bin/env tsx

import esMain from 'es-main'
import get from 'lodash/get.js'
import invoke from 'lodash/invoke.js'
import merge from 'lodash/merge.js'
import { CoreNamespace, loadSystem, Config } from '@node-in-layers/core'
import { McpClientNamespace } from '@node-in-layers/mcp-client'
import { ArgumentParser } from 'argparse'
import { create as createClientEntries } from '../src/client/entries.js'
import { create as createConfig } from '../src/config.js'
const _parseArguments = () => {
  const parser = new ArgumentParser({
    description: 'Runs the client',
  })
  parser.add_argument('environment', {
    help: 'The environment for the service.',
  })
  parser.add_argument('dotPath', {
    help: 'A dotted path to the value to executed. domain:function',
  })
  parser.add_argument('-d', '--data', {
    help: 'Stringified JSON data to pass to the dotPath',
  })
  return parser.parse_args()
}

const _loadConfig = async (environment: string) => {
  const filePath = `../config.${environment}.mts`
  const config = await (await import(filePath)).default()
  return createConfig(config)
}

const main = async () => {
  const args = _parseArguments()
  const config = await _loadConfig(args.environment)
  const client = await createClientEntries().createClient(config)
  const func = get(client, args.dotPath)
  if (!func) {
    console.error('Function not found')
    console.info(client)
    process.exit(1)
  }
  // We want to default with a blank object, because thats the standard for features.
  const data = args.data ? JSON.parse(args.data) : [{}]
  const finalData = Array.isArray(data) ? data : [data]
  // @ts-ignore
  const result = await invoke(client, args.dotPath, ...finalData)
  console.info(result)
}

if (esMain(import.meta)) {
  main()
}