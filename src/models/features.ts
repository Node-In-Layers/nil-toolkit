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
    { moduleName, data }: CreateModelProps,
    crossLayerProps?: CrossLayerProps
  ) => {
    const log = context.log.getInnerLogger('createModel')
    const services = context.services[Namespace.models]
    log.info('Validating module exists')
    if (!services.doesModuleExist({ moduleName }, crossLayerProps)) {
      throw new Error(`Module ${moduleName} does not exist under ./src`)
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
              { moduleName, pluralTitle: parsed.pluralTitle },
              crossLayerProps
            )
          ) {
            throw new Error(
              `Model ${parsed.pluralTitle} already exists in module ${moduleName}`
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
              { moduleName, pluralTitle: nextPluralTitle },
              crossLayerProps
            )
          ) {
            throw new Error(
              `Model ${nextPluralTitle} already exists in module ${moduleName}`
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

    services.ensureModelsDirectory({ moduleName }, crossLayerProps)
    services.ensureModelsIndex({ moduleName }, crossLayerProps)
    const source = buildModelSource({
      moduleName,
      pluralTitle: resolved.pluralTitle,
      singularTitle: resolved.singularTitle,
      primaryKeyName: resolved.primaryKeyName,
      includeCreatedAt: resolved.includeCreatedAt,
      includeUpdatedAt: resolved.includeUpdatedAt,
    })
    services.writeModelFile(
      { moduleName, pluralTitle: resolved.pluralTitle, source },
      crossLayerProps
    )
    services.exportModelInIndex(
      { moduleName, pluralTitle: resolved.pluralTitle },
      crossLayerProps
    )
    services.ensureTypesFile({ moduleName }, crossLayerProps)
    services.addTypeIfMissing(
      {
        moduleName,
        singularName: resolved.singularTitle,
        primaryKeyName: resolved.primaryKeyName,
        includeCreatedAt: resolved.includeCreatedAt,
        includeUpdatedAt: resolved.includeUpdatedAt,
      },
      crossLayerProps
    )
    log.info('Model created')
  }

  return {
    createModel,
  }
}
