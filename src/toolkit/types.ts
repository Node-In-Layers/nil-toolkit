type ToolkitServices = Readonly<{
}>

type ToolkitServicesLayer = {
  'nil-toolkit/toolkit': ToolkitServices
}

enum Command  {
  newApp='newApp',
  newPackage='newPackage',
  newSystem='newSystem',
}

export {
  ToolkitServicesLayer,
  ToolkitServices,
  Command,
}
