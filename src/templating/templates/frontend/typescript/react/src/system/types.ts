import { AppConfig } from '../types.js'
import { HomeFeaturesLayer, HomeServicesLayer } from '../home/types.js'

export type SystemContext = {
  config: AppConfig
  services: HomeServicesLayer
  features: HomeFeaturesLayer
}
