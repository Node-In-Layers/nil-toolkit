import { SimpleFeaturesDependencies } from '@node-in-layers/core/index.js'
import { promiseWrap } from '@node-in-layers/core/utils.js'
import { PackageFeaturesLayer } from '../package/types.js'
import { ToolkitServicesLayer } from './types.js'

const create = (
  dependencies: SimpleFeaturesDependencies<
    ToolkitServicesLayer,
    PackageFeaturesLayer
  >
) => {
  const createPackage = promiseWrap(
    dependencies.features['nil-toolkit/package'].createPackage
  )

  return {
    createPackage,
  }
}

export { create }
