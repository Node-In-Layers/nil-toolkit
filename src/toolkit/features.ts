import { SimpleFeaturesDependencies } from '@node-in-layers/core/index.js'
import { promiseWrap } from '@node-in-layers/core/utils.js'
import { PackageFeaturesLayer } from '../package/types.js'
import { AppFeaturesLayer } from '../app/types.js'
import { ToolkitServicesLayer } from './types.js'

const create = (
  dependencies: SimpleFeaturesDependencies<
    ToolkitServicesLayer,
    PackageFeaturesLayer & AppFeaturesLayer
  >
) => {
  const createPackage = promiseWrap(
    dependencies.features['nil-toolkit/package'].createPackage
  )
  const createApp = promiseWrap(
    dependencies.features['nil-toolkit/app'].createApp
  )

  return {
    createPackage,
    createApp,
  }
}

export { create }
