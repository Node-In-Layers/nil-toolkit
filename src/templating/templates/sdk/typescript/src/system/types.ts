import { HealthServicesLayer, HealthFeaturesLayer } from "../health/types.js"

/**
 * The system can be used within the shell, or across the SDK to reference the other domains/layers
 */
export type System = {
  // Append (&&) all of your ServicesLayers here.
  services: HealthServicesLayer
  // Append (&&) all of your FeaturesLayers here.
  features: HealthFeaturesLayer
}
