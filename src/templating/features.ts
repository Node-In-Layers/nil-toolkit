import { Config, FeaturesContext } from '@node-in-layers/core/index.js'
import { TemplatingServicesLayer, TemplatingFeaturesLayer } from './types.js'

const create = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: FeaturesContext<
    Config,
    TemplatingServicesLayer,
    TemplatingFeaturesLayer
  >
) => {
  return {}
}

export { create }
