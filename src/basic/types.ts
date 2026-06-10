import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type BasicServices = Readonly<{
  doesBasicAlreadyExist: LayerFunction<
    (props: { basicName: string }) => boolean
  >
  getPackageType: LayerFunction<
    (props: { packageType?: string }) => Promise<PackageType>
  >
}>

export type BasicServicesLayer = Readonly<{
  [Namespace.basic]: BasicServices
}>

export type BasicFeatures = Readonly<{
  createBasic: LayerFunction<
    (args: {
      basicName: string
      domainName?: string
      packageType?: PackageType
    }) => Promise<void>
  >
}>

export type BasicFeaturesLayer = Readonly<{
  [Namespace.basic]: BasicFeatures
}>
