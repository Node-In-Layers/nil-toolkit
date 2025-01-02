import { FeaturesDependencies, Config } from '@node-in-layers/core/index.js'
import { Namespace } from '../types.js'
import { PackageServicesLayer, PackageType } from './types.js'
import { applyTemplates, createValidPackageName } from './libs.js'

const create = (
  dependencies: FeaturesDependencies<Config, PackageServicesLayer>
) => {
  const ourServices = dependencies.services[Namespace.package]
  const createPackage = async ({
    packageName,
    packageType,
  }: {
    packageName: string
    packageType: PackageType
  }) => {
    packageName = createValidPackageName(packageName)
    const logger = dependencies.log.getLogger('nil-toolkit:createNewPackage')
    logger.info('Creating package directory')
    ourServices.createPackageDirectory(packageName)
    logger.info('Reading templates for all package types')
    const generalTemplates = await ourServices.readGeneralTemplates()
    logger.info(`Reading templates for ${packageType} package types`)
    const specificTemplates = await ourServices.readTemplates(packageType)
    const templates = generalTemplates.concat(specificTemplates)
    logger.info(`Apply templates`)
    const appliedTemplates = applyTemplates(templates, { packageName })
    logger.info(
      `Writing templates to ${dependencies.constants.workingDirectory}`
    )
    ourServices.writeTemplates(packageName, appliedTemplates)
    if (packageType === PackageType.typescript) {
      logger.info(`Running NPM Install`)
      ourServices.executeNpm(packageName, 'install')
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
