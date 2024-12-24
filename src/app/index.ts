import { SimpleFeaturesDependencies } from '@node-in-layers/core/index.js'
import { PackageServicesLayer, PackageType } from '../package/types.js'
import { AppServicesLayer, AppServices } from './types.js'
import { applyTemplates, createValidAppName } from './libs.js'

const features = {
  create: (
    deps: SimpleFeaturesDependencies<PackageServicesLayer & AppServicesLayer>
  ) => {
    const createApp = async ({ appName }: { appName: string }) => {
      const ourServices = deps.services['@nil/toolkit.app']
      const logger = deps.log.getLogger('@nil/toolkit:createApp')

      appName = createValidAppName(appName)

      if (!deps.services['@nil/toolkit.app'].isPackageRoot()) {
        throw new Error(
          `Must be located in the main directory of your node-in-layers system or package. This is the same directory as the package.json.`
        )
      }

      logger.debug('Checking if package exists.')
      if (ourServices.doesAppAlreadyExist(appName)) {
        throw new Error(`App ${appName} already exists.`)
      }

      logger.info('Getting current package name')
      const packageName = await ourServices.getPackageName()
      logger.info(`Package name is ${packageName}`)
      logger.info('Getting package type')
      const packageType = await ourServices.getPackageType()
      logger.info(`Package Type if ${packageType}`)
      logger.info('Reading Templates')
      const templates = await ourServices.readTemplates({ packageType })
      logger.info('Apply Templates')
      const appliedTemplates = applyTemplates(templates, {
        packageName,
        appName,
      })
      logger.info('Writing templates')
      ourServices.writeTemplates(appName, appliedTemplates)
      logger.info('Operation complete')
    }
    return {
      createApp,
    }
  },
}

const name = '@nil/toolkit.app'
export { services, features, name }
