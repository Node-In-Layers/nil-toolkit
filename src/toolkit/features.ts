import { FeaturesDependencies, Config } from '@node-in-layers/core/index.js'
import { promiseWrap } from '@node-in-layers/core/utils.js'
import { PackageFeaturesLayer } from '../package/types.js'
import { AppFeaturesLayer } from '../app/types.js'
import { Namespace } from '../types.js'

const create = (
  dependencies: FeaturesDependencies<
    Config,
    object,
    PackageFeaturesLayer & AppFeaturesLayer
  >
) => {
  const createPackage = promiseWrap(
    dependencies.features[Namespace.package].createPackage
  )
  const createApp = promiseWrap(dependencies.features[Namespace.app].createApp)

  return {
    createPackage,
    createApp,
  }
}

export { create }
