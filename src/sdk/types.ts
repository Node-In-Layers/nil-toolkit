import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type SdkServices = Readonly<{
  isSystemRoot: LayerFunction<() => Promise<boolean>>
  doesSdkAlreadyExist: LayerFunction<
    (props: { sdkName: string; rootDirName?: string }) => boolean
  >
  getPackageType: LayerFunction<
    (props: { packageType?: string }) => Promise<PackageType>
  >
}>

export type SdkServicesLayer = Readonly<{
  [Namespace.sdk]: SdkServices
}>

export type SdkFeatures = Readonly<{
  createSdk: LayerFunction<
    (args: {
      sdkName: string
      transport: 'mcp' | 'rest'
      packageType: PackageType
      rootDirName?: string
    }) => Promise<void>
  >
}>

export type SdkFeaturesLayer = Readonly<{
  [Namespace.sdk]: SdkFeatures
}>
