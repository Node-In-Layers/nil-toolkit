import { Namespace } from '../types.js'
import { PackageType } from '../package/types.js'

type SystemServices = Readonly<object>

type SystemServicesLayer = Readonly<{
  [Namespace.system]: SystemServices
}>

enum SystemType {
  rest = 'rest',
  react = 'react',
}

type SystemFeatures = Readonly<{
  createSystem: ({
    systemName,
    systemLanguage,
    systemType,
  }: {
    systemName: string
    systemLanguage: PackageType
    systemType: SystemType
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
  SystemType,
}
