import {
  Config,
  FeaturesContext,
  CrossLayerProps,
} from '@node-in-layers/core/index.js'
import { Namespace } from '../types.js'
import {
  buildModelSource,
  parseCreateModelData,
  toTitleNoSpaces,
  simpleSingularize,
} from './libs.js'
import {
  ModelsServicesLayer,
  ModelsFeaturesLayer,
  CreateModelProps,
} from './types.js'

export const create = (
  context: FeaturesContext<Config, ModelsServicesLayer, ModelsFeaturesLayer>
) => {
  const createModel = async (
    { domainName, data }: CreateModelProps,
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createModel')
    const services = context.services[Namespace.models]
    const systemJson = await context.services[
      Namespace.workspace
    ].getSystemJson(
      { inPath: context.constants.workingDirectory },
      crossLayerProps
    )

    const isPackage =
      typeof (systemJson as { isPackage?: boolean }).isPackage === 'boolean'
        ? (systemJson as { isPackage?: boolean }).isPackage === true
        : false

    if (!isPackage && !systemJson?.sdkName) {
      throw new Error('SDK name not found')
    }

    // For packages, we treat ./src as the SDK root. The models services
    // construct paths as <wd>/<sdkName>/src/<domainName>/..., so using "."
    // here makes that resolve to <wd>/src/<domainName>/..., which is what
    // we want for single-package SDKs.
    const sdkName = isPackage ? '.' : (systemJson.sdkName as string)

    log.info('Validating domain exists')
    if (!services.doesDomainExist({ sdkName, domainName }, crossLayerProps)) {
      throw new Error(`Domain ${domainName} does not exist under ./src`)
    }
    const defaults = {
      primaryKeyName: 'id',
      includeCreatedAt: true,
      includeUpdatedAt: true,
    } as const

    const resolved = data
      ? (() => {
          const parsed = parseCreateModelData(data)
          if (
            services.doesModelExist(
              { sdkName, domainName, pluralTitle: parsed.pluralTitle },
              crossLayerProps
            )
          ) {
            throw new Error(
              `Model ${parsed.pluralTitle} already exists in domain ${domainName}`
            )
          }
          return parsed
        })()
      : await (async () => {
          // Simple interactive prompts via stdin/stdout
          const ask = async (q: string, def?: string): Promise<string> => {
            process.stdout.write(def ? `${q} (default: ${def}): ` : `${q}: `)
            return new Promise(resolve => {
              process.stdin.once('data', d =>
                resolve(String(d).trim() || def || '')
              )
            })
          }
          const pluralName = await ask('What is the plural name of the model?')
          const nextPluralTitle = toTitleNoSpaces(pluralName)
          if (
            services.doesModelExist(
              { sdkName, domainName, pluralTitle: nextPluralTitle },
              crossLayerProps
            )
          ) {
            throw new Error(
              `Model ${nextPluralTitle} already exists in domain ${domainName}`
            )
          }
          const suggestedSingular = toTitleNoSpaces(
            simpleSingularize(pluralName)
          )
          const nextSingularTitle = await ask(
            'What is the singular name?',
            suggestedSingular
          )
          const pk = await ask('What is the primary key name?', 'id')
          const nextPrimaryKeyName = pk || defaults.primaryKeyName
          const createdAns = await ask(
            'Include createdAt time? (true/false)',
            'true'
          )
          const nextIncludeCreatedAt = /^true$/iu.test(createdAns)
          const updatedAns = await ask(
            'Include updatedAt time? (true/false)',
            'true'
          )
          const nextIncludeUpdatedAt = /^true$/iu.test(updatedAns)
          // Ensure stdin is paused so the process can exit cleanly
          if (process.stdin && typeof process.stdin.pause === 'function') {
            process.stdin.pause()
          }
          return {
            pluralTitle: nextPluralTitle,
            singularTitle: nextSingularTitle,
            primaryKeyName: nextPrimaryKeyName,
            includeCreatedAt: nextIncludeCreatedAt,
            includeUpdatedAt: nextIncludeUpdatedAt,
          }
        })()

    services.ensureModelsDirectory({ sdkName, domainName }, crossLayerProps)
    services.ensureModelsIndex({ sdkName, domainName }, crossLayerProps)
    const source = buildModelSource({
      domainName,
      pluralTitle: resolved.pluralTitle,
      singularTitle: resolved.singularTitle,
      primaryKeyName: resolved.primaryKeyName,
      includeCreatedAt: resolved.includeCreatedAt,
      includeUpdatedAt: resolved.includeUpdatedAt,
    })
    services.writeModelFile(
      { sdkName, domainName, pluralTitle: resolved.pluralTitle, source },
      crossLayerProps
    )
    services.exportModelInIndex(
      { sdkName, domainName, pluralTitle: resolved.pluralTitle },
      crossLayerProps
    )
    services.ensureTypesFile({ sdkName, domainName }, crossLayerProps)
    services.addTypeIfMissing(
      {
        sdkName,
        domainName,
        singularName: resolved.singularTitle,
        primaryKeyName: resolved.primaryKeyName,
        includeCreatedAt: resolved.includeCreatedAt,
        includeUpdatedAt: resolved.includeUpdatedAt,
      },
      crossLayerProps
    )
    services.ensureSdkDomainModelsExport(
      { domainName, systemJson },
      crossLayerProps
    )
    services.ensureBackendDomainModelsExport(
      { domainName, systemJson },
      crossLayerProps
    )
    log.info('Model created')
  }

  return {
    createModel,
  }
}
