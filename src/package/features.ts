import { FeaturesContext, Config } from '@node-in-layers/core/index.js'
import { Namespace } from '../types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { PackageServicesLayer, PackageType } from './types.js'

const create = (
  context: FeaturesContext<
    Config,
    PackageServicesLayer & TemplatingServicesLayer
  >
) => {
  const ourServices = context.services[Namespace.package]
  const templatingServices = context.services[Namespace.templating]
  const createPackage = async ({
    packageName,
    packageType,
  }: {
    packageName: string
    packageType: PackageType
  }) => {
    packageName = createValidName(packageName)
    const logger = context.log.getLogger('nil-toolkit:createPackage')
    logger.info('Creating package directory')
    templatingServices.createDirectory(packageName)
    logger.info('Reading templates for all package types')
    const generalTemplates = await templatingServices.readTemplates(
      'package',
      'all'
    )
    logger.info(`Reading templates for ${packageType} package types`)
    const specificTemplates = await templatingServices.readTemplates(
      'package',
      packageType
    )
    const templates = generalTemplates.concat(specificTemplates)
    logger.info(`Apply templates`)
    const data = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion('@node-in-layers/core'),
      packageName,
    }
    const appliedTemplates = applyTemplates(templates, data)
    logger.info(`Writing templates to ${context.constants.workingDirectory}`)
    templatingServices.writeTemplates(packageName, appliedTemplates)
    if (packageType === PackageType.typescript) {
      logger.info(`Running NPM Install`)
      ourServices.executeNpm(packageName, 'install')
      logger.info(`Building package`)
      ourServices.executeNpm(packageName, 'run build')
    }
    logger.info(`Running NPM Prettier`)
    ourServices.executeNpm(packageName, 'run prettier')
    logger.info(`Running NPM Eslint`)
    ourServices.executeNpm(packageName, 'run eslint')
    logger.info(`New package complete`)
  }

  return {
    createPackage,
  }
}

export { create }
