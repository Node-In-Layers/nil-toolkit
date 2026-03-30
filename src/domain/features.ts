import fs from 'node:fs'
import path from 'node:path'
import {
  FeaturesContext,
  Config,
  CrossLayerProps,
} from '@node-in-layers/core/index.js'
import { PackageServicesLayer } from '../package/types.js'
import { Namespace } from '../types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { DomainServicesLayer } from './types.js'

const appendSdkIndexDomainExportsIfNeeded = (
  props: Readonly<{ indexPath: string; domainName: string }>
) => {
  const { indexPath, domainName } = props
  if (!fs.existsSync(indexPath)) {
    return
  }
  const content = fs.readFileSync(indexPath, 'utf8')
  const fromDomain = `from './${domainName}/index.js'`
  if (content.includes(fromDomain)) {
    return
  }
  const block = `\nexport * as ${domainName} from './${domainName}/index.js'\nexport * from './${domainName}/types.js'\n`
  fs.appendFileSync(indexPath, block)
}

export const create = (
  context: FeaturesContext<
    Config,
    PackageServicesLayer &
      DomainServicesLayer &
      TemplatingServicesLayer &
      WorkspaceServicesLayer
  >
) => {
  const createDomain = async (
    props: {
      rootDirName?: string
      domainName: string
      namespace?: string
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createDomain', crossLayerProps)
    const ourServices = context.services[Namespace.domain]

    const domainName = createValidName(props.domainName)

    const basePath = props.rootDirName
      ? path.join(context.constants.workingDirectory, props.rootDirName)
      : context.constants.workingDirectory

    if (
      !context.services[Namespace.workspace].isSystemRoot(
        { inPath: basePath },
        crossLayerProps
      )
    ) {
      throw new Error(
        `Must be located in the main directory of your node-in-layers system (directory containing nil.system.json).`
      )
    }

    const systemJson = await context.services[
      Namespace.workspace
    ].getSystemJson({ inPath: basePath }, crossLayerProps)

    const isPackage =
      typeof (systemJson as { isPackage?: boolean }).isPackage === 'boolean'
        ? (systemJson as { isPackage?: boolean }).isPackage === true
        : false

    if (!isPackage && !systemJson?.sdkName) {
      throw new Error('SDK name not found')
    }

    const sdkNameForDomain = isPackage ? '.' : (systemJson.sdkName as string)

    log.debug('Checking if package exists.')
    if (
      ourServices.doesDomainAlreadyExist(
        { sdkName: sdkNameForDomain, domainName },
        crossLayerProps
      )
    ) {
      throw new Error(`Domain ${domainName} already exists.`)
    }

    log.info('Getting package type')
    const packageType = await ourServices.getPackageType(
      { sdkName: sdkNameForDomain },
      crossLayerProps
    )
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
      domainName,
      appName: domainName, // back-compat for legacy templates
      namespace: props.namespace || domainName,
    }
    const appliedTemplates = applyTemplates(templates, data)

    log.info('Writing templates')
    if (isPackage) {
      // For packages, rely on the template relative paths (which already
      // include "src/DOMAIN_NAME/...") and write directly under the package
      // root without adding an extra "src" or domain directory prefix.
      context.services[Namespace.templating].writeTemplates(
        {
          packageName: domainName,
          templates: appliedTemplates,
          options: {
            ignoreNameInDir: true,
          },
        },
        crossLayerProps
      )
      appendSdkIndexDomainExportsIfNeeded({
        indexPath: path.join(basePath, 'src', 'index.ts'),
        domainName,
      })
      return
    }

    log.info('Writing templates to SDK')
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: domainName,
        templates: appliedTemplates,
        options: {
          baseDirName: systemJson.sdkName as string,
          ignoreNameInDir: true,
        },
      },
      crossLayerProps
    )

    if (sdkNameForDomain !== '.') {
      appendSdkIndexDomainExportsIfNeeded({
        indexPath: path.join(basePath, sdkNameForDomain, 'src', 'index.ts'),
        domainName,
      })
    }

    const backendNames = systemJson.backends || []
    const frontendNames = systemJson.frontends || []

    backendNames.forEach(backendName => {
      log.info(`Writing templates to Backend ${backendName}`)
      context.services[Namespace.templating].writeTemplates(
        {
          packageName: domainName,
          templates: appliedTemplates,
          options: {
            baseDirName: backendName,
            ignoreNameInDir: true,
          },
        },
        crossLayerProps
      )
    })

    frontendNames.forEach(frontendName => {
      log.info(`Writing templates to Frontend ${frontendName}`)
      context.services[Namespace.templating].writeTemplates(
        {
          packageName: domainName,
          templates: appliedTemplates,
          options: {
            baseDirName: frontendName,
            ignoreNameInDir: true,
          },
        },
        crossLayerProps
      )
    })
  }

  return {
    createDomain,
  }
}
