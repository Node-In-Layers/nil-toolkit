import path from 'node:path'
import { FeaturesContext, Config, CrossLayerProps } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageServicesLayer } from '../package/types.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import {
  buildTemplateVersions,
  COMMON_DEV,
  COMMON_RUNTIME,
  NIL_BASIC,
} from '../templating/dependencyVersions.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { BasicServicesLayer } from './types.js'

type BasicCreateContext = FeaturesContext<
  Config,
  BasicServicesLayer &
    TemplatingServicesLayer &
    WorkspaceServicesLayer &
    PackageServicesLayer
>

const BASIC_RUNTIME = COMMON_RUNTIME.filter(pkg =>
  ['functional-models', 'argparse', 'chalk', 'es-main', 'lodash'].includes(pkg)
)

const runBasicPackageLifecycle = (
  context: BasicCreateContext,
  fullPath: string,
  log: { info: (message: string) => void },
  crossLayerProps?: CrossLayerProps
) => {
  const pkg = Namespace.package
  const run = (command: string) =>
    context.services[pkg].executeBashCommand(
      { packageName: fullPath, command },
      crossLayerProps
    )
  log.info('Running NPM Install')
  run('npm install')
  log.info('Running NPM Build')
  run('npm run build')
  log.info('Running NPM Prettier')
  run('npm run prettier')
  log.info('Running NPM Eslint')
  run('npm run eslint')
}

export const create = (context: BasicCreateContext) => {
  const createBasic = async (
    props: {
      basicName?: string
      domainName?: string
      packageType?: any
    },
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createBasic', crossLayerProps)

    if (!props || !props.basicName) {
      throw new Error('basicName is required')
    }

    const basicName = createValidName(props.basicName)
    const domainName = createValidName(props.domainName || 'app')
    const basePath = path.join(context.constants.workingDirectory, basicName)

    if (
      context.services[Namespace.basic].doesBasicAlreadyExist(
        { basicName },
        crossLayerProps
      )
    ) {
      throw new Error(`Basic package ${basicName} already exists.`)
    }

    log.info('Creating basic package')
    await context.services[Namespace.workspace].ensureDirectory({
      inPath: basePath,
    })

    const systemName = basicName.startsWith('@') ? basicName : `@${basicName}`
    const fullBasicPackageName = `${systemName}/${basicName}`

    const packageType = await context.services[Namespace.basic].getPackageType(
      { packageType: props.packageType || 'typescript' },
      crossLayerProps
    )

    const templates = await context.services[
      Namespace.templating
    ].readTemplates({ name: 'basic', packageType }, crossLayerProps)

    const versions = await buildTemplateVersions(
      context,
      { include: [...NIL_BASIC, ...BASIC_RUNTIME, ...COMMON_DEV] },
      crossLayerProps
    )

    const data = {
      ...versions,
      basicName,
      domainName,
      namespace: domainName,
      systemName,
      fullBasicPackageName,
    }

    const appliedTemplates = applyTemplates(templates, data)
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: basicName,
        templates: appliedTemplates,
        options: { baseDirName: basicName, ignoreNameInDir: true },
      },
      crossLayerProps
    )

    runBasicPackageLifecycle(context, basicName, log, crossLayerProps)
    log.info('Operation complete')
  }

  return { createBasic }
}
