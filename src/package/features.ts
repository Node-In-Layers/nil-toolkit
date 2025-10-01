import {
  FeaturesContext,
  Config,
  CrossLayerProps,
} from '@node-in-layers/core/index.js'
import { Namespace } from '../types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer, PackageType } from '../templating/types.js'
import { PackageServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    PackageServicesLayer & TemplatingServicesLayer
  >
) => {
  const ourServices = context.services[Namespace.package]
  const templatingServices = context.services[Namespace.templating]

  const createPackage = async (
    props: {
      packageName: string
      packageType: PackageType
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createPackage', crossLayerProps)
    const packageName = createValidName(props.packageName)
    log.info('Creating package directory')
    templatingServices.createDirectory({ name: packageName }, crossLayerProps)
    log.info('Reading templates for all package types')
    const generalTemplates = await templatingServices.readTemplates(
      {
        name: 'package',
        packageType: 'all',
      },
      crossLayerProps
    )
    log.info(`Reading templates for ${props.packageType} package types`)
    const specificTemplates = await templatingServices.readTemplates(
      {
        name: 'package',
        packageType: props.packageType,
      },
      crossLayerProps
    )
    const templates = generalTemplates.concat(specificTemplates)
    log.info(`Apply templates`)
    const data = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
      packageName,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info(`Writing templates to ${context.constants.workingDirectory}`)
    templatingServices.writeTemplates(
      {
        packageName,
        templates: appliedTemplates,
      },
      crossLayerProps
    )
    if (props.packageType === PackageType.typescript) {
      log.info(`Running NPM Install`)
      ourServices.executeNpm(
        { packageName, command: 'install' },
        crossLayerProps
      )
      log.info(`Running NPM Build`)
      log.info(`Building package`)
      ourServices.executeNpm(
        { packageName, command: 'run build' },
        crossLayerProps
      )
    }
    log.info(`Running NPM Prettier`)
    ourServices.executeNpm(
      { packageName, command: 'run prettier' },
      crossLayerProps
    )
    log.info(`Running NPM Build`)
    ourServices.executeNpm(
      { packageName, command: 'run build' },
      crossLayerProps
    )
    log.info(`Running NPM Eslint`)
    ourServices.executeNpm(
      { packageName, command: 'run eslint' },
      crossLayerProps
    )
    log.info(`New package complete`)
  }

  return {
    createPackage,
  }
}
