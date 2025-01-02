import { Namespace } from '../types.js'
import { PackageType } from '../package/types.js'

type SystemServices = Readonly<object>

type SystemServicesLayer = Readonly<{
  [Namespace.system]: SystemServices
}>

type SystemFeatures = Readonly<{
  createSystem: ({
    systemName,
    systemType,
  }: {
    systemName: string
    systemType: PackageType
  }) => Promise<void>
}>

type SystemFeaturesLayer = Readonly<{
  [Namespace.system]: SystemFeatures
}>

export {
  SystemFeatures,
  SystemFeaturesLayer,
  SystemServices,
  SystemServicesLayer,
}
