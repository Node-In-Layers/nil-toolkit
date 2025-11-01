import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'

export type CreateModelProps = Readonly<{
  domainName: string
  data?: string
}>

export type ModelsServices = Readonly<{
  doesDomainExist: LayerFunction<
    (props: { sdkName: string; domainName: string }) => boolean
  >
  doesModelExist: LayerFunction<
    (props: {
      sdkName: string
      domainName: string
      pluralTitle: string
    }) => boolean
  >
  ensureModelsDirectory: LayerFunction<
    (props: { sdkName: string; domainName: string }) => void
  >
  ensureModelsIndex: LayerFunction<
    (props: { sdkName: string; domainName: string }) => void
  >
  exportModelInIndex: LayerFunction<
    (props: {
      sdkName: string
      domainName: string
      pluralTitle: string
    }) => void
  >
  writeModelFile: LayerFunction<
    (props: {
      sdkName: string
      domainName: string
      pluralTitle: string
      source: string
    }) => void
  >
  ensureTypesFile: LayerFunction<
    (props: { sdkName: string; domainName: string }) => void
  >
  addTypeIfMissing: LayerFunction<
    (props: {
      sdkName: string
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
