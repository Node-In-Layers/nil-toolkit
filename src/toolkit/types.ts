import { Namespace } from '../types.js'

type ToolkitServices = Readonly<object>

type ToolkitServicesLayer = {
  [Namespace.toolkit]: ToolkitServices
}

enum Command {
  createApp = 'createApp',
  createPackage = 'createPackage',
  createSystem = 'createSystem',
}

export { ToolkitServicesLayer, ToolkitServices, Command }
