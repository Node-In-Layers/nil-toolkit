import { LayerFunction } from '@node-in-layers/core'
import { PackageType } from '../templating/types.js'
import { Namespace } from '../types.js'

export type DomainServices = Readonly<{
  doesDomainAlreadyExist: LayerFunction<
    (props: { sdkName: string; domainName: string }) => boolean
  >
  getPackageType: LayerFunction<
    ({ sdkName }: { sdkName: string }) => Promise<PackageType>
  >
}>

export type DomainServicesLayer = Readonly<{
  [Namespace.domain]: DomainServices
}>

export type DomainFeatures = Readonly<{
  createDomain: LayerFunction<
    ({
      domainName,
    }: {
      domainName: string
      rootDirName?: string
    }) => Promise<void>
  >
}>

export type DomainFeaturesLayer = Readonly<{
  [Namespace.domain]: DomainFeatures
}>
