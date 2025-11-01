import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import {
  Config,
  CrossLayerProps,
  ServicesContext,
} from '@node-in-layers/core/index.js'
import { Namespace } from '../types.js'
import { WorkspaceServicesLayer } from '../workspace/types.js'
import { DomainServices } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const create = (
  context: ServicesContext<Config, WorkspaceServicesLayer>
): DomainServices => {
  const doesDomainAlreadyExist = (props: {
    sdkName: string
    domainName: string
  }) => {
    const dirPath = path.join(__dirname, props.sdkName, props.domainName)
    return fs.existsSync(dirPath)
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
