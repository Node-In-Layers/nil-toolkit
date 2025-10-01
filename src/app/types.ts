import { LayerFunction } from '@node-in-layers/core'
import { PackageType } from '../templating/types.js'
import { Namespace } from '../types.js'

export type AppServices = Readonly<{
  isPackageRoot: LayerFunction<() => Promise<boolean>>
  doesAppAlreadyExist: LayerFunction<
    ({ appName }: { appName: string }) => boolean
  >
  getPackageName: LayerFunction<() => Promise<string>>
  getPackageType: LayerFunction<() => Promise<PackageType>>
}>

export type AppServicesLayer = Readonly<{
  [Namespace.app]: AppServices
}>

export type AppFeatures = Readonly<{
  createApp: LayerFunction<({ appName }: { appName: string }) => Promise<void>>
}>

export type AppFeaturesLayer = Readonly<{
  [Namespace.app]: AppFeatures
}>
