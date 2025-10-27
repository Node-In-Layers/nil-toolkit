import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'

export type CreateModelProps = Readonly<{
  domainName: string
  data?: string
}>

export type ModelsServices = Readonly<{
  doesDomainExist: LayerFunction<
    ({ domainName }: { domainName: string }) => boolean
  >
  doesModelExist: LayerFunction<
    ({
      domainName,
      pluralTitle,
    }: {
      domainName: string
      pluralTitle: string
    }) => boolean
  >
  ensureModelsDirectory: LayerFunction<
    ({ domainName }: { domainName: string }) => void
  >
  ensureModelsIndex: LayerFunction<
    ({ domainName }: { domainName: string }) => void
  >
  exportModelInIndex: LayerFunction<
    ({
      domainName,
      pluralTitle,
    }: {
      domainName: string
      pluralTitle: string
    }) => void
  >
  writeModelFile: LayerFunction<
    ({
      domainName,
      pluralTitle,
      source,
    }: {
      domainName: string
      pluralTitle: string
      source: string
    }) => void
  >
  ensureTypesFile: LayerFunction<
    ({ domainName }: { domainName: string }) => void
  >
  addTypeIfMissing: LayerFunction<
    ({
      domainName,
      singularName,
      primaryKeyName,
      includeCreatedAt,
      includeUpdatedAt,
    }: {
      domainName: string
      singularName: string
      primaryKeyName: string
      includeCreatedAt: boolean
      includeUpdatedAt: boolean
    }) => void
  >
}>

export type ModelsServicesLayer = Readonly<{
  [Namespace.models]: ModelsServices
}>

export type ModelsFeatures = Readonly<{
  createModel: LayerFunction<(props: CreateModelProps) => Promise<void>>
}>

export type ModelsFeaturesLayer = Readonly<{
  [Namespace.models]: ModelsFeatures
}>
