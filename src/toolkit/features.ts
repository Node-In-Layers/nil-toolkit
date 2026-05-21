import { FeaturesContext, Config } from '@node-in-layers/core/index.js'
import { promiseWrap } from '@node-in-layers/core/utils.js'
import { PackageFeaturesLayer } from '../package/types.js'
import { DomainFeaturesLayer } from '../domain/types.js'
import { SystemFeaturesLayer } from '../system/types.js'
import { Namespace } from '../types.js'
import { ModelsFeaturesLayer } from '../models/types.js'

export const create = (
  context: FeaturesContext<
    Config,
    object,
    PackageFeaturesLayer &
      DomainFeaturesLayer &
      SystemFeaturesLayer &
      ModelsFeaturesLayer
  >
) => {
  const createSystem = promiseWrap(
    context.features[Namespace.system].createSystem
  )
  const createPackage = promiseWrap(
    context.features[Namespace.package].createPackage
  )
  // Primary: createDomain
  const createDomain = promiseWrap(
    context.features[Namespace.domain].createDomain
  )

  const createModel = promiseWrap(
    context.features[Namespace.models].createModel
  )

  // New generators
  const createSdk = promiseWrap(context.features[Namespace.sdk].createSdk)
  const createBackend = promiseWrap(
    context.features[Namespace.backend].createBackend
  )
  const createFrontend = promiseWrap(
    context.features[Namespace.frontend].createFrontend
  )

  return {
    createSystem,
    createPackage,
    createDomain,
    createModel,
    createSdk,
    createBackend,
    createFrontend,
  }
}
