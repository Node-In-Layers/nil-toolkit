import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type BackendServices = Readonly<{
  isSystemRoot: LayerFunction<(props?: { inPath?: string }) => Promise<boolean>>
  doesBackendAlreadyExist: LayerFunction<
    (props: { backendName: string; rootDirName?: string }) => boolean
  >
  getPackageType: LayerFunction<
    (props: { packageType?: string }) => Promise<PackageType>
  >
}>

export type BackendServicesLayer = Readonly<{
  [Namespace.backend]: BackendServices
}>

export type BackendFeatures = Readonly<{
  createBackend: LayerFunction<
    (args: {
      backendName: string
      type: 'mcp' | 'rest'
      sdkName: string
      packageType: PackageType
      rootDirName?: string
    }) => Promise<void>
  >
}>

export type BackendFeaturesLayer = Readonly<{
  [Namespace.backend]: BackendFeatures
}>
