import { SimpleFeaturesDependencies } from '@node-in-layers/core/index.js'
import { promiseWrap } from '@node-in-layers/core/utils.js'
import {ToolkitServicesLayer} from "./types.js"
import { PackageFeaturesLayer } from '../package/types.js'
import {cliCommandToCommand} from "./libs.js"

const create = (dependencies: SimpleFeaturesDependencies<ToolkitServicesLayer, PackageFeaturesLayer>) => {

  const newPackage = promiseWrap(dependencies.features['nil-toolkit/package'].createNewPackage)

  return {
    newPackage,
  }
}

export {
  create,
}
