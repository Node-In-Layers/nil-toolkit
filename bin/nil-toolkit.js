#!/usr/bin/env node
import { ArgumentParser } from 'argparse'
import { loadSystem } from '../dist/entries.js'
import camelCase from 'lodash/camelCase.js'
import esMain from 'es-main'
import { Namespace } from '../dist/types.js'

const _parseArguments = () => {
  const parser = new ArgumentParser({
    description: 'A toolkit for dealing with Node In Layers systems.',
  })
  parser.add_argument('-f', '--logFormat', {
    help: 'Sets the format for logging. Defaults to simple.',
  })
  parser.add_argument('-l', '--logLevel', {
    help: 'Sets the log level. Defaults to info',
  })
  const subParsers = parser.add_subparsers({
    title: 'command',
    dest: 'command',
  })
  const newApp = subParsers.add_parser('create-app', {
    help: 'Create a new app in an existing system.',
  })

  newApp.add_argument('appName', {
    help: 'The name of the app',
  })
  newApp.add_argument('-n', '--namespace', {
    help: 'The namespace for the app. Defaults to the appName.',
  })

  const packageParser = subParsers.add_parser('create-package', {
    help: 'Create a new package.',
  })
  packageParser.add_argument('packageName', {
    help: 'The name for the package.',
  })
  packageParser.add_argument('packageType', {
    help: 'typescript, esm, commonjs',
  })
  const addSystemParser = subParsers.add_parser('create-system', {
    help: 'Create a new Node In Layers system.',
  })
  addSystemParser.add_argument('systemName', {
    help: 'The name for the system.',
  })
  addSystemParser.add_argument('systemLanguage', {
    help: 'typescript, esm, commonjs',
  })
  addSystemParser.add_argument('systemType', {
    help: 'rest, react',
  })

  const args = parser.parse_args()
  if (!args.command) {
    parser.print_help()
    return
  }
  return args
}

const main = async () => {
  const args = _parseArguments()
  if (!args) {
    return
  }

  const system = await loadSystem(args)
  const command = camelCase(args.command)
  await system.features[Namespace.toolkit][command](args).catch(e => {
    console.error(e.message)
    console.error(e)
  })
}

if (esMain(import.meta)) {
  main()
}
