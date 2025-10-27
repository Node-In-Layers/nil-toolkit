import fs from 'node:fs'
import path from 'node:path'
import { Config, CrossLayerProps, ServicesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { BackendServices } from './types.js'

export const create = (
  context: ServicesContext<Config, WorkspaceServicesLayer>
): BackendServices => {
  const isSystemRoot = async (crossLayerProps?: CrossLayerProps) =>
    context.services[Namespace.workspace].isSystemRoot(crossLayerProps)

  const doesBackendAlreadyExist = (props: {
    backendName: string
    rootDirName?: string
  }) => {
    const base = props.rootDirName
      ? path.join(context.constants.workingDirectory, props.rootDirName)
      : context.constants.workingDirectory
    const dirPath = path.join(base, props.backendName)
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

  return { isSystemRoot, doesBackendAlreadyExist, getPackageType }
}
