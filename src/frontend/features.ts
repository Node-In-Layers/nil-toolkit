import path from 'node:path'
import { FeaturesContext, Config, CrossLayerProps } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import {
  buildTemplateVersions,
  COMMON_DEV,
  FRONTEND_DEV,
  FRONTEND_RUNTIME,
  NIL_FRONTEND,
} from '../templating/dependencyVersions.js'
import { PackageServicesLayer } from '../package/types.js'
import { FrontendServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    FrontendServicesLayer & TemplatingServicesLayer & PackageServicesLayer
  >
) => {
  const createFrontend = async (
    props: {
      frontendName?: string
      framework?: 'react'
      sdkName?: string
      rootDirName?: string
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createFrontend', crossLayerProps)

    if (!props || !props.frontendName) {
      throw new Error('frontendName is required')
    }
    if (!props.framework) {
      throw new Error('framework is required (react)')
    }
    if (!props.sdkName) {
      throw new Error('sdkName is required')
    }

    const basePath = props.rootDirName
      ? path.join(context.constants.workingDirectory, props.rootDirName)
      : context.constants.workingDirectory

    const inRoot = await context.services[Namespace.frontend].isSystemRoot(
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

    const frontendName = createValidName(props.frontendName || 'frontend')
    const fullFrontendPackageName = `${systemName}/${frontendName}`
    const fullPath = props.rootDirName
      ? path.join(props.rootDirName, frontendName)
      : frontendName

    const alreadyExists = context.services[
      Namespace.frontend
    ].doesFrontendAlreadyExist(
      { frontendName, rootDirName: props.rootDirName },
      crossLayerProps
    )
    if (alreadyExists) {
      throw new Error(`Frontend ${frontendName} already exists.`)
    }
    const packageType = await context.services[
      Namespace.frontend
    ].getPackageType({ packageType: 'typescript' }, crossLayerProps)
    const framework = props.framework || 'react'
    const templates = await context.services[
      Namespace.templating
    ].readTemplates(
      { name: 'frontend', packageType, nested: framework },
      crossLayerProps
    )
    const versions = await buildTemplateVersions(
      context,
      {
        include: [
          ...NIL_FRONTEND,
          'functional-models',
          'functional-models-orm-mcp',
          ...FRONTEND_RUNTIME,
          ...COMMON_DEV,
          ...FRONTEND_DEV,
        ],
      },
      crossLayerProps
    )
    const data = {
      ...versions,
      systemName,
      frontendName,
      fullFrontendPackageName,
      framework,
      sdkName: props.sdkName || 'sdk',
      fullSdkPackageName: `${systemName}/${props.sdkName}`,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info('Writing templates')
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: frontendName,
        templates: appliedTemplates,
        options: { baseDirName: props.rootDirName },
      },
      crossLayerProps
    )

    log.info('Adding Frontend Name')
    await context.services[Namespace.workspace].addFrontendName(
      { inPath: basePath, frontendName },
      crossLayerProps
    )

    log.info('Running NPM Install')
    context.services[Namespace.package].executeNpm(
      { packageName: fullPath, command: 'install' },
      crossLayerProps
    )
    log.info('Running NPM Eslint')
    context.services[Namespace.package].executeNpm(
      { packageName: fullPath, command: 'run eslint' },
      crossLayerProps
    )
    log.info('Running NPM Prettier')
    context.services[Namespace.package].executeNpm(
      { packageName: fullPath, command: 'run prettier' },
      crossLayerProps
    )

    log.info('Operation complete')
  }

  return { createFrontend }
}
