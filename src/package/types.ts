import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type PackageServices = Readonly<{
  executeNpm: LayerFunction<
    (props: { packageName: string; command: string; args?: string[] }) => void
  >
  executeBashCommand: LayerFunction<
    (props: {
      packageName: string
      command: string
      args?: readonly string[]
    }) => void
  >
}>

export type PackageServicesLayer = Readonly<{
  [Namespace.package]: PackageServices
}>

export type PackageFeatures = Readonly<{
  createPackage: LayerFunction<
    (props: { packageName: string; packageType: PackageType }) => Promise<void>
  >
}>

export type PackageFeaturesLayer = Readonly<{
  [Namespace.package]: PackageFeatures
}>
