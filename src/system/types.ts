import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

export type SystemServices = Readonly<{
  ensureSystemDirectory: LayerFunction<(props: { systemName: string }) => void>
  writeSystemMarker: LayerFunction<
    (props: { systemName: string; description: string }) => void
  >
  linkSdkInPackage: LayerFunction<
    (props: {
      systemName: string
      packageName: string
      sdkName: string
    }) => void
  >
}>

export type SystemServicesLayer = Readonly<{
  [Namespace.system]: SystemServices
}>

export type SystemFeatures = Readonly<{
  createSystem: LayerFunction<
    ({
      systemName,
      systemLanguage,
      sdkName,
      sdkTransport,
      backendName,
      backendType,
      frontendName,
      noFrontend,
    }: {
      systemName: string
      systemLanguage: PackageType
      sdkName: string
      sdkTransport: 'mcp' | 'rest'
      backendName: string
      backendType: 'mcp' | 'rest'
      frontendName?: string
      noFrontend?: boolean
    }) => Promise<void>
  >
}>

export type SystemFeaturesLayer = Readonly<{
  [Namespace.system]: SystemFeatures
}>
