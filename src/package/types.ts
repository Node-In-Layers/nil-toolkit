import { Namespace } from '../types.js'
import { PackageType } from '../templating/types.js'

type PackageServices = Readonly<{
  executeNpm: (packageName: string, command: string, args?: string[]) => void
  executeBashCommand: (
    packageName: string,
    command: string,
    args?: readonly string[]
  ) => void
}>

type PackageServicesLayer = Readonly<{
  [Namespace.package]: PackageServices
}>

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
  PackageFeatures,
  PackageFeaturesLayer,
}
