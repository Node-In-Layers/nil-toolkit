import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type SystemServices = Readonly<object>

export type SystemServicesLayer = Readonly<{
  [Namespace.system]: SystemServices
}>

export enum SystemType {
  rest = 'rest',
  react = 'react',
}

export type SystemFeatures = Readonly<{
  createSystem: LayerFunction<
    ({
      systemName,
      systemLanguage,
      systemType,
    }: {
      systemName: string
      systemLanguage: PackageType
      systemType: SystemType
    }) => Promise<void>
  >
}>

export type SystemFeaturesLayer = Readonly<{
  [Namespace.system]: SystemFeatures
}>
