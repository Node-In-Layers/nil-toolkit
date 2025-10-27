import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type WorkspaceServices = Readonly<{
  getSystemMarker: LayerFunction<
    (props?: { inPath?: string }) => Promise<string | undefined>
  >
  isSystemRoot: LayerFunction<() => Promise<boolean>>
  getPackageType: LayerFunction<
    (props: { packageType?: string; inPath?: string }) => Promise<PackageType>
  >
  getSystemName: LayerFunction<(props?: { inPath?: string }) => Promise<string>>
}>

export type WorkspaceServicesLayer = Readonly<{
  [Namespace.workspace]: WorkspaceServices
}>
