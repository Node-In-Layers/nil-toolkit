import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import * as glob from 'glob'
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
  const _getPackageJson = async (): Promise<string | undefined> => {
    const wd = `${context.constants.workingDirectory}/package.json`
    return (await glob.glob(wd)).find(
      p => fs.lstatSync(p).isFile() && p.endsWith('package.json')
    )
  }

  const isPackageRoot = async () => {
    const packageJson = await _getPackageJson()
    return Boolean(packageJson)
  }

  const doesDomainAlreadyExist = (props: { domainName: string }) => {
    const dirPath = path.join(__dirname, props.domainName)
    return fs.existsSync(dirPath)
  }

  const getPackageName = async () => {
    const packagePath = await _getPackageJson()
    if (!packagePath) {
      throw new Error(`package.json could not be found`)
    }
    const data = fs.readFileSync(packagePath, 'utf-8')
    const asJson = JSON.parse(data)
    return asJson.name
  }

  const getPackageType = async (crossLayerProps?: CrossLayerProps) =>
    context.services[Namespace.workspace].getPackageType(
      { inPath: context.constants.workingDirectory },
      crossLayerProps
    )

  return {
    isPackageRoot,
    doesDomainAlreadyExist,
    getPackageName,
    getPackageType,
  }
}
