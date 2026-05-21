import { FeaturesContext } from '@node-in-layers/core'
import { SystemConfig } from '../types.js'
import { HomeServicesLayer, HomeFeaturesLayer, HomeFeatures } from './types.js'

const create = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: FeaturesContext<SystemConfig, HomeServicesLayer, HomeFeaturesLayer>
) : HomeFeatures => {
  return {
  }
}

export { create }