import { LayerFunction } from '@node-in-layers/core'
import { Namespace } from '../types.js'

export type TemplatedFile = {
  relativePath: string
  sourceData: string
}

export type FinalizedTemplate = Readonly<{
  relativePath: string
  templatedData: string
}>

export enum PackageType {
  typescript = 'typescript',
  esm = 'esm',
}

export type TemplatingServices = Readonly<{
  createDirectory: LayerFunction<
    (props: { name: string; options?: { inSrc: boolean } }) => void
  >
  readTemplates: LayerFunction<
    (props: {
      name: string
      packageType: PackageType | 'all'
      nested?: string
    }) => Promise<readonly TemplatedFile[]>
  >
  writeTemplates: LayerFunction<
    (props: {
      packageName: string
      templates: readonly Required<FinalizedTemplate>[]
      options?: { ignoreNameInDir?: boolean }
    }) => void
  >
  getDependencyVersion: LayerFunction<
    (props: { key: string }) => Promise<string>
  >
}>

export type TemplatingServicesLayer = Readonly<{
  [Namespace.templating]: TemplatingServices
}>

export type TemplatingFeatures = Readonly<object>

export type TemplatingFeaturesLayer = Readonly<{
  [Namespace.templating]: TemplatingFeatures
}>
