import { Namespace } from '../types.js'

type PackageServices = Readonly<{
  createPackageDirectory: (packageName: string) => void
  readGeneralTemplates: () => Promise<readonly TemplatedFile[]>
  readTemplates: (packageType: PackageType) => Promise<readonly TemplatedFile[]>
  writeTemplates: (
    packageName: string,
    templates: readonly Required<FinalizedTemplate>[]
  ) => void
  executeNpm: (packageName: string, command: string, args?: string[]) => void
}>

type PackageServicesLayer = Readonly<{
  [Namespace.package]: PackageServices
}>

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
  commonjs = 'commonjs',
}

type PackageFeatures = Readonly<{
  createPackage: ({
    packageName,
    packageType,
  }: {
    packageName: string
    packageType: PackageType
  }) => Promise<void>
}>

type PackageFeaturesLayer = Readonly<{
  [Namespace.package]: PackageFeatures
}>

export {
  PackageServices,
  PackageServicesLayer,
  PackageType,
  TemplatedFile,
  FinalizedTemplate,
  PackageFeatures,
  PackageFeaturesLayer,
}
