import { FeaturesContext, Config, CrossLayerProps } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { FrontendServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    FrontendServicesLayer & TemplatingServicesLayer
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

    const inRoot =
      await context.services[Namespace.frontend].isSystemRoot(crossLayerProps)
    if (!inRoot) {
      throw new Error(
        `Must be executed in a Node In Layers system root (directory containing nil.system.json).`
      )
    }

    const systemNameRaw = await context.services[
      Namespace.workspace
    ].getSystemName({}, crossLayerProps)
    const systemName = systemNameRaw.startsWith('@')
      ? systemNameRaw
      : `@${systemNameRaw}`

    const frontendName = createValidName(props.frontendName || 'frontend')
    const fullFrontendPackageName = `${systemName}/${frontendName}`

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
    const versions = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
    }
    const data = {
      versions,
      systemName,
      frontendName,
      fullFrontendPackageName,
      framework,
      sdkName: props.sdkName || 'sdk',
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
  }

  return { createFrontend }
}
