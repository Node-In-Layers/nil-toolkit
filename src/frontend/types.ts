import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type FrontendServices = Readonly<{
  isSystemRoot: LayerFunction<(props?: { inPath?: string }) => Promise<boolean>>
  doesFrontendAlreadyExist: LayerFunction<
    (props: { frontendName: string; rootDirName?: string }) => boolean
  >
  getPackageType: LayerFunction<
    (props: { packageType?: string }) => Promise<PackageType>
  >
}>

export type FrontendServicesLayer = Readonly<{
  [Namespace.frontend]: FrontendServices
}>

export type FrontendFeatures = Readonly<{
  createFrontend: LayerFunction<
    (args: {
      frontendName: string
      framework: 'react'
      sdkName: string
      rootDirName?: string
    }) => Promise<void>
  >
}>

export type FrontendFeaturesLayer = Readonly<{
  [Namespace.frontend]: FrontendFeatures
}>
