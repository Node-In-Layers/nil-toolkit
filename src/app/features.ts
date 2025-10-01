import {
  FeaturesContext,
  Config,
  CrossLayerProps,
} from '@node-in-layers/core/index.js'
import { PackageServicesLayer } from '../package/types.js'
import { Namespace } from '../types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { AppServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    PackageServicesLayer & AppServicesLayer & TemplatingServicesLayer
  >
) => {
  const createApp = async (
    props: {
      appName: string
      namespace?: string
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createApp')
    const ourServices = context.services[Namespace.app]

    const appName = createValidName(props.appName)

    if (!context.services[Namespace.app].isPackageRoot()) {
      throw new Error(
        `Must be located in the main directory of your node-in-layers system or package. This is the same directory as the package.json.`
      )
    }

    log.debug('Checking if package exists.')
    if (ourServices.doesAppAlreadyExist({ appName }, crossLayerProps)) {
      throw new Error(`App ${appName} already exists.`)
    }

    log.info('Getting current package name')
    const packageName = await ourServices.getPackageName()
    log.info(`Package name is ${packageName}`)
    log.info('Getting package type')
    const packageType = await ourServices.getPackageType()
    log.info(`Package Type if ${packageType}`)
    log.info('Reading Templates')
    const templates = await context.services[
      Namespace.templating
    ].readTemplates({ name: 'app', packageType: packageType }, crossLayerProps)
    log.info('Apply Templates')
    const data = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
      packageName,
      appName,
      namespace: props.namespace || appName,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info('Writing templates')
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: appName,
        templates: appliedTemplates,
        options: { ignoreNameInDir: true },
      },
      crossLayerProps
    )
    log.info('Operation complete')
  }
  return {
    createApp,
  }
}
