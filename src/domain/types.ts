import { LayerFunction } from '@node-in-layers/core'
import { PackageType } from '../templating/types.js'
import { Namespace } from '../types.js'

export type DomainServices = Readonly<{
  isPackageRoot: LayerFunction<() => Promise<boolean>>
  doesDomainAlreadyExist: LayerFunction<
    ({ domainName }: { domainName: string }) => boolean
  >
  getPackageName: LayerFunction<() => Promise<string>>
  getPackageType: LayerFunction<() => Promise<PackageType>>
}>

export type DomainServicesLayer = Readonly<{
  [Namespace.domain]: DomainServices
}>

export type DomainFeatures = Readonly<{
  createDomain: LayerFunction<
    ({ domainName }: { domainName: string }) => Promise<void>
  >
}>

export type DomainFeaturesLayer = Readonly<{
  [Namespace.domain]: DomainFeatures
}>
