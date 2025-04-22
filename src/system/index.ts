import { Config, FeaturesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import {
  PackageFeaturesLayer,
  PackageServicesLayer,
  PackageType,
} from '../package/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { SystemServices, SystemServicesLayer } from './types.js'

const services = {
  create: (): SystemServices => {
    return {}
  },
}

const features = {
  create: (
    context: FeaturesContext<
      Config,
      SystemServicesLayer & TemplatingServicesLayer & PackageServicesLayer,
      PackageFeaturesLayer
    >
  ) => {
    const templatingServices =
      context.services['@node-in-layers/toolkit/templating']
    const packageServices = context.services['@node-in-layers/toolkit/package']

    const createSystem = context.log.logWrapAsync('createSystem', async (log, { systemName, systemLanguage, systemType }) => {
      systemName = createValidName(systemName)
      await context.features['@node-in-layers/toolkit/package'].createPackage({
        packageName: systemName,
        packageType: systemLanguage,
      })
      // Now we override the package with system related data.
      log.info('Overriding package data with system data')
      const specificTemplates = await templatingServices.readTemplates(
        'system',
        systemLanguage,
        systemType
      )
      const generalTemplates = await templatingServices.readTemplates(
        'system',
        'all'
      )
      const templates = generalTemplates.concat(specificTemplates)
      log.info(`Apply templates`)
      const data = {
        nodeInLayersDbVersion: await context.services[
          Namespace.templating
        ].getDependencyVersion('@node-in-layers/data'),
        nodeInLayersCoreVersion: await context.services[
          Namespace.templating
        ].getDependencyVersion('@node-in-layers/core'),
        systemName,
        appName: systemName,
        packageName: systemName,
      }
      const appliedTemplates = applyTemplates(templates, data)
      log.info(`Writing templates to ${context.constants.workingDirectory}`)
      templatingServices.writeTemplates(systemName, appliedTemplates)
      if (systemLanguage === PackageType.typescript) {
        log.info(`Running NPM Install`)
        packageServices.executeNpm(systemName, 'install')
        if (systemType === 'rest') {
          log.info(`Building system`)
          packageServices.executeNpm(systemName, 'run build')
        } else if (systemType === 'react') {
          packageServices.executeBashCommand(systemName, 'rm -Rf ./dist')
        }
      }
      log.info(`Running NPM Prettier`)
      packageServices.executeNpm(systemName, 'run prettier')
      log.info(`Running NPM Eslint`)
      packageServices.executeNpm(systemName, 'run eslint')
      log.info(`New package complete`)
      return
    })

    return {
      createSystem,
    }
  },
}

const name = Namespace.system
export { services, features, name }
