import { Namespace } from '../types.js'

export type ToolkitServices = Readonly<object>

export type ToolkitServicesLayer = {
  [Namespace.toolkit]: ToolkitServices
}

export enum Command {
  createApp = 'createApp',
  createDomain = 'createDomain',
  createPackage = 'createPackage',
  createSystem = 'createSystem',
  createModel = 'createModel',
}
