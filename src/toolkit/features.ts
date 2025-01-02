import { FeaturesContext, Config } from '@node-in-layers/core/index.js'
import { promiseWrap } from '@node-in-layers/core/utils.js'
import { PackageFeaturesLayer } from '../package/types.js'
import { AppFeaturesLayer } from '../app/types.js'
import { SystemFeaturesLayer } from '../system/types.js'
import { Namespace } from '../types.js'

const create = (
  context: FeaturesContext<
    Config,
    object,
    PackageFeaturesLayer & AppFeaturesLayer & SystemFeaturesLayer
  >
) => {
  const createSystem = promiseWrap(
    context.features[Namespace.system].createSystem
  )
  const createPackage = promiseWrap(
    context.features[Namespace.package].createPackage
  )
  const createApp = promiseWrap(context.features[Namespace.app].createApp)

  return {
    createSystem,
    createPackage,
    createApp,
  }
}

export { create }
