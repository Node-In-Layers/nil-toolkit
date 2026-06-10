import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type SystemJson = Readonly<{
  name: string
  description?: string
  sdkName?: string
  backends?: string[]
  frontends?: string[]
  /**
   * When true, this nil.system.json represents a single package
   * (library, basic app, etc.) rather than a full multi-package system.
   * Source lives at ./src.
   */
  isPackage?: boolean
}>

export type WorkspaceServices = Readonly<{
  ensureDirectory: LayerFunction<(props: { inPath: string }) => void>
  writeSystemMarker: LayerFunction<
    (props: { inPath: string; systemJson: SystemJson }) => void
  >
  getSystemMarker: LayerFunction<
    (props?: { inPath?: string }) => Promise<string | undefined>
  >
  isSystemRoot: LayerFunction<(props?: { inPath?: string }) => Promise<boolean>>
  getPackageType: LayerFunction<
    (props: { packageType?: string; inPath?: string }) => Promise<PackageType>
  >
  getSystemName: LayerFunction<(props?: { inPath?: string }) => Promise<string>>
  setSdkName: LayerFunction<
    (props: { sdkName: string; inPath?: string }) => Promise<void>
  >
  addBackendName: LayerFunction<
    (props: { backendName: string; inPath?: string }) => Promise<void>
  >
  addFrontendName: LayerFunction<
    (props: { frontendName: string; inPath?: string }) => Promise<void>
  >
  getSystemJson: LayerFunction<
    (props?: { inPath?: string }) => Promise<SystemJson>
  >
}>

export type WorkspaceServicesLayer = Readonly<{
  [Namespace.workspace]: WorkspaceServices
}>
