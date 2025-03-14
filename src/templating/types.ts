import { Namespace } from '../types.js'

type TemplatedFile = {
  relativePath: string
  sourceData: string
}

type FinalizedTemplate = Readonly<{
  relativePath: string
  templatedData: string
}>

enum PackageType {
  typescript = 'typescript',
  esm = 'esm',
}

type TemplatingServices = Readonly<{
  createDirectory: (name: string, options?: { inSrc: boolean }) => void
  readTemplates: (
    name: string,
    packageType: PackageType | 'all',
    nested?: string
  ) => Promise<readonly TemplatedFile[]>
  writeTemplates: (
    packageName: string,
    templates: readonly Required<FinalizedTemplate>[],
    options?: { ignoreNameInDir?: boolean }
  ) => void
  getDependencyVersion: (key: string) => Promise<string>
}>

type TemplatingServicesLayer = Readonly<{
  [Namespace.templating]: TemplatingServices
}>

type TemplatingFeatures = Readonly<object>

type TemplatingFeaturesLayer = Readonly<{
  [Namespace.templating]: TemplatingFeatures
}>

export {
  TemplatingServices,
  TemplatingServicesLayer,
  TemplatingFeatures,
  TemplatingFeaturesLayer,
  TemplatedFile,
  FinalizedTemplate,
  PackageType,
}
