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
  const createModelParser = subParsers.add_parser('create-model', {
    help: 'Create a new model in an existing module.',
  })
  createModelParser.add_argument('domainName', {
    help: 'The name of the module to add the model to.',
  })
  createModelParser.add_argument('-d', '--data', {
    help: 'JSON string of arguments for non-interactive usage',
  })

  const newDomain = subParsers.add_parser('create-domain', {
    help: 'Create a new domain in an existing system.',
  })
  newDomain.add_argument('domainName', {
    help: 'The name of the domain',
  })
  newDomain.add_argument('-n', '--namespace', {
    help: 'The namespace for the domain. Defaults to the domainName.',
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
    help: 'Create a complete new Node In Layers system.',
  })
  addSystemParser.add_argument('systemName', {
    help: 'The name for the system.',
  })
  addSystemParser.add_argument('systemLanguage', {
    help: 'typescript, esm, commonjs',
  })
  addSystemParser.add_argument('-s', '--sdk-name', {
    help: 'SDK package name (directory).',
    default: 'sdk',
  })
  addSystemParser.add_argument('-t', '--sdk-transport', {
    help: 'SDK transport: mcp|rest',
    default: 'mcp',
  })
  addSystemParser.add_argument('-b', '--backend-name', {
    help: 'Backend server package name (directory).',
    default: 'backend',
  })
  addSystemParser.add_argument('-a', '--type', {
    default: 'mcp',
    help: 'Backend server type: mcp|rest',
  })
  addSystemParser.add_argument('-e', '--frontend-name', {
    help: 'Frontend package name (directory).',
    default: 'frontend',
  })
  addSystemParser.add_argument('-n', '--no-frontend', {
    action: 'store_true',
    help: 'Skip creating the frontend package',
  })

  const createSdkParser = subParsers.add_parser('create-sdk', {
    help: 'Create a new SDK package (with embedded client).',
  })
  createSdkParser.add_argument('-s', '--sdk-name', {
    help: 'Name of the SDK',
    default: 'sdk',
  })
  createSdkParser.add_argument('-t', '--transport', {
    help: 'mcp|rest',
    default: 'mcp',
  })
  createSdkParser.add_argument('-p', '--packageType', {
    default: 'typescript',
    help: 'typescript|esm',
  })

  const createBackendParser = subParsers.add_parser('create-backend', {
    help: 'Create a new backend server.',
  })
  createBackendParser.add_argument('backendName', {
    help: 'Name of the backend server.',
  })
  createBackendParser.add_argument('-t', '--type', {
    help: 'mcp|rest',
    default: 'mcp',
  })
  createBackendParser.add_argument('-s', '--sdk-name', {
    help: 'SDK name to depend on',
    default: 'sdk',
  })
  createBackendParser.add_argument('-p', '--packageType', {
    default: 'typescript',
    help: 'typescript|esm',
  })

  const createFrontendParser = subParsers.add_parser('create-frontend', {
    help: 'Create a new frontend package.',
  })
  createFrontendParser.add_argument('frontendName', {
    help: 'Name of the frontend',
  })
  createFrontendParser.add_argument('-w', '--framework', {
    help: 'react',
    default: 'react',
  })
  createFrontendParser.add_argument('-s', '--sdk-name', {
    help: 'SDK name to depend on',
    default: 'sdk',
    dest: 'sdkName',
  })

  const args = parser.parse_args()
  if (!args.command) {
    parser.print_help()
    return
  }
  return args
}

const _normalizeArgs = raw => {
  const out = {}
  for (const [k, v] of Object.entries(raw)) {
    out[camelCase(k)] = v
  }
  return out
}

const main = async () => {
  const args = _parseArguments()
  if (!args) {
    return
  }

  const normalized = _normalizeArgs(args)
  const system = await loadSystem(normalized)
  const command = camelCase(normalized.command)
  await system.features[Namespace.toolkit][command](normalized).catch(e => {
    console.error(e.message)
    console.error(e)
  })
}

if (esMain(import.meta)) {
  main()
}
