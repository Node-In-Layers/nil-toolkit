import fs from 'node:fs'
import path from 'node:path'
import { Config, CrossLayerProps, ServicesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { BasicServices } from './types.js'

export const create = (
  context: ServicesContext<Config, WorkspaceServicesLayer>
): BasicServices => {
  const doesBasicAlreadyExist = (props: { basicName: string }) => {
    const dirPath = path.join(
      context.constants.workingDirectory,
      props.basicName
    )
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

  return { doesBasicAlreadyExist, getPackageType }
}
