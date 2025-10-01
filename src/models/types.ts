import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'

export type CreateModelProps = Readonly<{
  moduleName: string
  data?: string
}>

export type ModelsServices = Readonly<{
  doesModuleExist: LayerFunction<
    ({ moduleName }: { moduleName: string }) => boolean
  >
  doesModelExist: LayerFunction<
    ({
      moduleName,
      pluralTitle,
    }: {
      moduleName: string
      pluralTitle: string
    }) => boolean
  >
  ensureModelsDirectory: LayerFunction<
    ({ moduleName }: { moduleName: string }) => void
  >
  ensureModelsIndex: LayerFunction<
    ({ moduleName }: { moduleName: string }) => void
  >
  exportModelInIndex: LayerFunction<
    ({
      moduleName,
      pluralTitle,
    }: {
      moduleName: string
      pluralTitle: string
    }) => void
  >
  writeModelFile: LayerFunction<
    ({
      moduleName,
      pluralTitle,
      source,
    }: {
      moduleName: string
      pluralTitle: string
      source: string
    }) => void
  >
  ensureTypesFile: LayerFunction<
    ({ moduleName }: { moduleName: string }) => void
  >
  addTypeIfMissing: LayerFunction<
    ({
      moduleName,
      singularName,
      primaryKeyName,
      includeCreatedAt,
      includeUpdatedAt,
    }: {
      moduleName: string
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
