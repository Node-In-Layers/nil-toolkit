import fs from 'node:fs'
import path from 'node:path'
import {
  Config,
  CrossLayerProps,
  ServicesContext,
} from '@node-in-layers/core/index.js'
import { Namespace } from '../types.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { DomainServices } from './types.js'

export const create = (
  context: ServicesContext<Config, WorkspaceServicesLayer>
): DomainServices => {
  const doesDomainAlreadyExist = (props: {
    sdkName: string
    domainName: string
  }) => {
    const dirPath = path.join(
      context.constants.workingDirectory,
      props.sdkName,
      'src',
      props.domainName
    )
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
  }
  const getPackageType = async (
    props: { sdkName: string },
    crossLayerProps?: CrossLayerProps
  ) =>
    context.services[Namespace.workspace].getPackageType(
      { inPath: path.join(context.constants.workingDirectory, props.sdkName) },
      crossLayerProps
    )

  return {
    doesDomainAlreadyExist,
    getPackageType,
  }
}
