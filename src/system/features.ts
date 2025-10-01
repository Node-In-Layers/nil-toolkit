import { Config, CrossLayerProps, FeaturesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageFeaturesLayer, PackageServicesLayer } from '../package/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer, PackageType } from '../templating/types.js'
import { SystemServicesLayer, SystemType } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    SystemServicesLayer & TemplatingServicesLayer & PackageServicesLayer,
    PackageFeaturesLayer
  >
) => {
  const templatingServices =
    context.services['@node-in-layers/toolkit/templating']
  const packageServices = context.services['@node-in-layers/toolkit/package']

  const createSystem = async (
    props: {
      systemName: string
      systemLanguage: PackageType
      systemType: SystemType
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createSystem')
    const { systemLanguage, systemType } = props
    const systemName = createValidName(props.systemName)
    await context.features['@node-in-layers/toolkit/package'].createPackage(
      {
        packageName: systemName,
        packageType: systemLanguage,
      },
      crossLayerProps
    )
    // Now we override the package with system related data.
    log.info('Overriding package data with system data')
    const specificTemplates = await templatingServices.readTemplates(
      {
        name: 'system',
        packageType: systemLanguage,
        nested: systemType,
      },
      crossLayerProps
    )
    const generalTemplates = await templatingServices.readTemplates(
      {
        name: 'system',
        packageType: 'all',
      },
      crossLayerProps
    )
    const templates = generalTemplates.concat(specificTemplates)
    log.info(`Apply templates`)
    const data = {
      nodeInLayersDbVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/data' }, crossLayerProps),
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
      systemName,
      appName: systemName,
      packageName: systemName,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info(`Writing templates to ${context.constants.workingDirectory}`)
    templatingServices.writeTemplates(
      {
        packageName: systemName,
        templates: appliedTemplates,
      },
      crossLayerProps
    )
    if (systemLanguage === PackageType.typescript) {
      log.info(`Running NPM Install`)
      packageServices.executeNpm(
        {
          packageName: systemName,
          command: 'install',
        },
        crossLayerProps
      )
      if (systemType === 'rest') {
        log.info(`Building system`)
        packageServices.executeNpm(
          {
            packageName: systemName,
            command: 'run build',
          },
          crossLayerProps
        )
      } else if (systemType === 'react') {
        packageServices.executeBashCommand(
          {
            packageName: systemName,
            command: 'rm -Rf ./dist',
          },
          crossLayerProps
        )
      }
    }
    log.info(`Running NPM Prettier`)
    packageServices.executeNpm(
      {
        packageName: systemName,
        command: 'run prettier',
      },
      crossLayerProps
    )
    log.info(`Running NPM Eslint`)
    packageServices.executeNpm(
      {
        packageName: systemName,
        command: 'run eslint',
      },
      crossLayerProps
    )
    log.info(`New package complete`)
    return
  }

  return {
    createSystem,
  }
}
