import path from 'node:path'
import { FeaturesContext, Config, CrossLayerProps } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { BackendServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    BackendServicesLayer & TemplatingServicesLayer
  >
) => {
  const createBackend = async (
    props: {
      backendName?: string
      type?: 'mcp' | 'rest'
      sdkName?: string
      rootDirName?: string
      packageType?: any
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createBackend', crossLayerProps)

    if (!props || !props.backendName) {
      throw new Error('backendName is required')
    }
    if (!props.type) {
      throw new Error('type is required (mcp|rest)')
    }
    if (!props.sdkName) {
      throw new Error('sdkName is required')
    }

    const basePath = props.rootDirName
      ? path.join(context.constants.workingDirectory, props.rootDirName)
      : context.constants.workingDirectory

    const inRoot = await context.services[Namespace.backend].isSystemRoot(
      { inPath: basePath },
      crossLayerProps
    )
    if (!inRoot) {
      throw new Error(
        `Must be executed in a Node In Layers system root (directory containing nil.system.json).`
      )
    }

    const systemNameRaw = await context.services[
      Namespace.workspace
    ].getSystemName({ inPath: basePath }, crossLayerProps)
    const systemName = systemNameRaw.startsWith('@')
      ? systemNameRaw
      : `@${systemNameRaw}`

    const backendName = createValidName(props.backendName || 'backend')
    const fullBackendPackageName = `${systemName}/${backendName}`
    const sdkName = createValidName(props.sdkName || 'sdk')
    const fullSdkPackageName = `${systemName}/${sdkName}`
    const fullPath = props.rootDirName
      ? path.join(props.rootDirName, backendName)
      : backendName

    const alreadyExists = context.services[
      Namespace.backend
    ].doesBackendAlreadyExist(
      {
        backendName,
        rootDirName: props.rootDirName,
      },
      crossLayerProps
    )
    if (alreadyExists) {
      throw new Error(`Backend ${backendName} already exists.`)
    }
    const packageType = await context.services[
      Namespace.backend
    ].getPackageType({ packageType: 'typescript' }, crossLayerProps)
    const backendType = props.type || 'mcp'
    if (backendType === 'rest') {
      throw new Error(
        'REST API scaffolding is not implemented yet. Please use --type mcp (default).'
      )
    }
    const templates = await context.services[
      Namespace.templating
    ].readTemplates(
      { name: 'backend', packageType, nested: backendType },
      crossLayerProps
    )
    const versions = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
      nodeInLayersDataVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/data' }, crossLayerProps),
      nodeInLayersMcpServerVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion(
        { key: '@node-in-layers/mcp-server' },
        crossLayerProps
      ),
      nodeInLayersRestServerVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion(
        { key: '@node-in-layers/rest-api' },
        crossLayerProps
      ),
      functionalModelsVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: 'functional-models' }, crossLayerProps),
      functionalModelsOrmMcpVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion(
        { key: 'functional-models-orm-mcp' },
        crossLayerProps
      ),
    }
    const data = {
      versions,
      backendName,
      systemName,
      fullBackendPackageName,
      sdkName,
      fullSdkPackageName,
      backendType,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info('Writing templates')
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: backendName,
        templates: appliedTemplates,
        options: { baseDirName: props.rootDirName },
      },
      crossLayerProps
    )

    log.info('Adding Backend Name')
    await context.services[Namespace.workspace].addBackendName(
      { inPath: basePath, backendName },
      crossLayerProps
    )

    log.info('Running NPM Install')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: fullPath,
        command: 'npm install',
      },
      crossLayerProps
    )
    log.info('Running NPM Build')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: fullPath,
        command: 'npm run build',
      },
      crossLayerProps
    )
    log.info('Running NPM Prettier')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: fullPath,
        command: 'npm run prettier',
      },
      crossLayerProps
    )
    log.info('Running NPM Eslint')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: fullPath,
        command: 'npm run eslint',
      },
      crossLayerProps
    )
    log.info('Operation complete')
  }

  return { createBackend }
}
