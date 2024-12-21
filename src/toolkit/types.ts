type ToolkitServices = Readonly<object>

type ToolkitServicesLayer = {
  'nil-toolkit/toolkit': ToolkitServices
}

enum Command {
  createApp = 'createApp',
  createPackage = 'createPackage',
  createSystem = 'createSystem',
}

export { ToolkitServicesLayer, ToolkitServices, Command }
