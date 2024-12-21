type PackageServices = Readonly<{
  createPackageDirectory: (packageName: string) => void,
  readGeneralTemplates: () => Promise<readonly TemplatedPackageFile[]>,
  readTemplates: (packageType: PackageType) => Promise<readonly TemplatedPackageFile[]>,
  writeTemplates: (packageName: string, templates: readonly Required<FinalizedTemplate>[]) => void
  executeNpm: (packageName: string, command: string, args?: string[]) => void
}>

type PackageServicesLayer = Readonly<{
  'nil-toolkit/package': PackageServices
}>

type TemplatedPackageFile = {
  relativePath: string,
  sourceData: string
}

type FinalizedTemplate = Readonly<{
  relativePath: string,
  templatedData: string
}>

enum PackageType {
  typescript='typescript',
  esm='esm',
  commonjs='commonjs'
}

type PackageFeatures = Readonly<{
  createNewPackage: ({packageName, packageType}:{ packageName: string, packageType: PackageType}) => Promise<void>
}>

type PackageFeaturesLayer = Readonly<{
  'nil-toolkit/package': PackageFeatures
}>

export {
  PackageServices,
  PackageServicesLayer,
  PackageType,
  TemplatedPackageFile,
  FinalizedTemplate,
  PackageFeatures,
  PackageFeaturesLayer,
}
