import { SystemConfig } from '../types.js'
import { HomeFeaturesLayer, HomeServicesLayer } from '../home/types.js'

export type SystemContext = {
  config: SystemConfig
  services: HomeServicesLayer
  features: HomeFeaturesLayer
}
