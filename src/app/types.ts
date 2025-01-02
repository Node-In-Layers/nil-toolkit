import { PackageType } from '../templating/types.js'
import { Namespace } from '../types.js'

type AppServices = Readonly<{
  isPackageRoot: () => Promise<boolean>
  doesAppAlreadyExist: (appName: string) => boolean
  getPackageName: () => Promise<string>
  getPackageType: () => Promise<PackageType>
}>

type AppServicesLayer = Readonly<{
  [Namespace.app]: AppServices
}>

type AppFeatures = Readonly<{
  createApp: ({ appName }: { appName: string }) => Promise<void>
}>

type AppFeaturesLayer = Readonly<{
  [Namespace.app]: AppFeatures
}>

export { AppServices, AppServicesLayer, AppFeatures, AppFeaturesLayer }
