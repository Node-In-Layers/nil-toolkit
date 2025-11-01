import fs from 'node:fs'
import path from 'node:path'
import { Config, CrossLayerProps, ServicesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { SdkServices } from './types.js'

export const create = (
  context: ServicesContext<Config, WorkspaceServicesLayer>
): SdkServices => {
  const isSystemRoot = async (
    props?: { inPath?: string },
    crossLayerProps?: CrossLayerProps
  ) =>
    context.services[Namespace.workspace].isSystemRoot(props, crossLayerProps)

  const doesSdkAlreadyExist = (props: {
    sdkName: string
    rootDirName?: string
  }) => {
    const base = props.rootDirName
      ? path.join(context.constants.workingDirectory, props.rootDirName)
      : context.constants.workingDirectory
    const dirPath = path.join(base, props.sdkName)
    return fs.existsSync(dirPath)
  }

  const getPackageType = async (
    props: { packageType?: string },
    crossLayerProps?: CrossLayerProps
  ) =>
    context.services[Namespace.workspace].getPackageType(
      {
        packageType: props.packageType || 'typescript',
        inPath: context.constants.workingDirectory,
      },
      crossLayerProps
    )

  return { isSystemRoot, doesSdkAlreadyExist, getPackageType }
}
