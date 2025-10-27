import {
  FeaturesContext,
  Config,
  CrossLayerProps,
} from '@node-in-layers/core/index.js'
import { PackageServicesLayer } from '../package/types.js'
import { Namespace } from '../types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { DomainServicesLayer } from './types.js'

export const create = (
  context: FeaturesContext<
    Config,
    PackageServicesLayer & DomainServicesLayer & TemplatingServicesLayer
  >
) => {
  const createDomain = async (
    props: {
      domainName: string
      namespace?: string
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createDomain', crossLayerProps)
    const ourServices = context.services[Namespace.domain]

    const domainName = createValidName(props.domainName)

    if (!context.services[Namespace.domain].isPackageRoot(crossLayerProps)) {
      throw new Error(
        `Must be located in the main directory of your node-in-layers system or package. This is the same directory as the package.json.`
      )
    }

    log.debug('Checking if package exists.')
    if (ourServices.doesDomainAlreadyExist({ domainName }, crossLayerProps)) {
      throw new Error(`Domain ${domainName} already exists.`)
    }

    log.info('Getting current package name')
    const packageName = await ourServices.getPackageName(crossLayerProps)
    log.info(`Package name is ${packageName}`)
    log.info('Getting package type')
    const packageType = await ourServices.getPackageType(crossLayerProps)
    log.info(`Package Type if ${packageType}`)
    log.info('Reading Templates')
    const templates = await context.services[
      Namespace.templating
    ].readTemplates(
      { name: 'domain', packageType: packageType },
      crossLayerProps
    )
    log.info('Apply Templates')
    const data = {
      nodeInLayersCoreVersion: await context.services[
        Namespace.templating
      ].getDependencyVersion({ key: '@node-in-layers/core' }, crossLayerProps),
      packageName,
      domainName,
      appName: domainName, // back-compat for legacy templates
      namespace: props.namespace || domainName,
    }
    const appliedTemplates = applyTemplates(templates, data)
    log.info('Writing templates')
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: domainName,
        templates: appliedTemplates,
        options: { ignoreNameInDir: true },
      },
      crossLayerProps
    )
    log.info('Operation complete')
  }
  return {
    createDomain,
  }
}
