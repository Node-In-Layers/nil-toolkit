import {
  PackageType,
  TemplatedFile,
  FinalizedTemplate,
} from '../package/types.js'
import { Namespace } from '../types.js'

type AppServices = Readonly<{
  isPackageRoot: () => Promise<boolean>
  doesAppAlreadyExist: (appName: string) => boolean
  getPackageName: () => Promise<string>
  getPackageType: () => Promise<PackageType>
  readTemplates: ({ packageType }) => Promise<readonly TemplatedFile[]>
  writeTemplates: (
    appName: string,
    templates: readonly FinalizedTemplate[]
  ) => void
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
