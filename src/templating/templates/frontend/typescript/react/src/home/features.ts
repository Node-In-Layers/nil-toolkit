import { FeaturesContext } from '@node-in-layers/core'
import { AppConfig } from '../types.js'
import { HomeServicesLayer, HomeFeaturesLayer, HomeFeatures } from './types.js'

const create = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: FeaturesContext<AppConfig, HomeServicesLayer, HomeFeaturesLayer>
) : HomeFeatures => {
  return {
  }
}

export { create }