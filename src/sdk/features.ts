import path from 'node:path'
import { FeaturesContext, Config, CrossLayerProps } from '@node-in-layers/core'
import { PackageType, TemplatingServicesLayer } from '../templating/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { Namespace } from '../types.js'
import { SdkServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<Config, SdkServicesLayer & TemplatingServicesLayer>
) => {
  const createSdk = async (
    props: {
      sdkName: string
      transport: 'mcp' | 'rest'
      packageType: PackageType
      rootDirName?: string
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createSdk', crossLayerProps)

    if (!props || !props.sdkName) {
      throw new Error('sdkName is required')
    }
    if (!props.transport) {
      throw new Error('transport is required (mcp|rest)')
    }
    if (!props.packageType) {
      throw new Error('packageType is required (e.g., typescript)')
    }

    if (!props.rootDirName) {
      const inRoot =
        await context.services[Namespace.sdk].isSystemRoot(crossLayerProps)
      if (!inRoot) {
        throw new Error(
          `Must be executed in a Node In Layers system root (directory containing nil.system.json).`
        )
      }
    }

    const basePath = props.rootDirName
      ? path.join(context.constants.workingDirectory, props.rootDirName)
      : context.constants.workingDirectory

    const systemNameRaw = await context.services[
      Namespace.workspace
    ].getSystemName({ inPath: basePath }, crossLayerProps)
    const systemName = systemNameRaw.startsWith('@')
      ? systemNameRaw
      : `@${systemNameRaw}`

    const sdkName = createValidName(props.sdkName)
    const fullSdkPackageName = `${systemName}/${sdkName}`

    const alreadyExists = context.services[Namespace.sdk].doesSdkAlreadyExist(
      {
        sdkName,
        rootDirName: props.rootDirName,
      },
      crossLayerProps
    )
    if (alreadyExists) {
      throw new Error(`SDK ${sdkName} already exists.`)
    }
    const templates = await context.services[
      Namespace.templating
    ].readTemplates(
      { name: 'sdk', packageType: props.packageType },
      crossLayerProps
    )

    const transport = props.transport || 'mcp'
    if (transport === 'rest') {
      throw new Error(
        'REST SDK scaffolding is not implemented yet. Please use --transport mcp (default).'
      )
    }
    const versions = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
      nodeInLayersMcpClientVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion(
        { key: '@node-in-layers/mcp-client' },
        crossLayerProps
      ),
      nodeInLayersRestClientVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion(
        { key: '@node-in-layers/rest-client' },
        crossLayerProps
      ),
      mcpAiVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@l4t/mcp-ai' }, crossLayerProps),
      functionalModelsOrmMcpVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion(
        { key: 'functional-models-orm-mcp' },
        crossLayerProps
      ),
      functionalModelsVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: 'functional-models' }, crossLayerProps),
    }
    const data = {
      versions,
      sdkName,
      systemName,
      fullSdkPackageName,
      transport,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info('Writing templates')
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: sdkName,
        templates: appliedTemplates,
        options: { baseDirName: props.rootDirName },
      },
      crossLayerProps
    )

    log.info('Running NPM Install')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: sdkName,
        command: 'npm install',
      },
      crossLayerProps
    )
    log.info('Running NPM Build')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: sdkName,
        command: 'npm run build',
      },
      crossLayerProps
    )
    log.info('Running NPM Prettier')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: sdkName,
        command: 'npm run prettier',
      },
      crossLayerProps
    )
    log.info('Running NPM Eslint')
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: sdkName,
        command: 'npm run eslint',
      },
      crossLayerProps
    )
    log.info('Operation complete')
  }

  return { createSdk }
}
