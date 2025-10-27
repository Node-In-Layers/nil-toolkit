import fs from 'node:fs'
import * as glob from 'glob'
import { CrossLayerProps, ServicesContext } from '@node-in-layers/core/index.js'
import { PackageType } from '../templating/types.js'
import { WorkspaceServices } from './types.js'

export const create = (context: ServicesContext): WorkspaceServices => {
  const getSystemMarker = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    crossLayerProps?: CrossLayerProps
  ): Promise<string | undefined> => {
    const wd = `${context.constants.workingDirectory}/nil.system.json`
    return (await glob.glob(wd)).find(p => fs.existsSync(p))
  }

  const isSystemRoot = async (crossLayerProps?: CrossLayerProps) =>
    Boolean(await getSystemMarker(crossLayerProps))

  const getPackageType = async (props: {
    packageType?: string
    inPath?: string
  }): Promise<PackageType> => {
    if (props.packageType) {
      return props.packageType as PackageType
    }
    const base = props.inPath || context.constants.workingDirectory
    const hasTsconfig = fs.existsSync(`${base}/tsconfig.json`)
    if (hasTsconfig) {
      return PackageType.typescript
    }
    const pkgJsonPath = `${base}/package.json`
    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
      if (pkg.type === 'module') {
        return PackageType.esm
      }
    }
    return PackageType.esm
  }

  const getSystemName = async (
    _props?: { inPath?: string },
    crossLayerProps?: CrossLayerProps
  ): Promise<string> => {
    const marker = await getSystemMarker(crossLayerProps)
    if (!marker) {
      throw new Error('nil.system.json not found in current directory')
    }

    try {
      const json = JSON.parse(fs.readFileSync(marker, 'utf-8'))
      if (!json.name || typeof json.name !== 'string') {
        throw new Error('Invalid nil.system.json: missing name')
      }
      return json.name as string
    } catch {
      throw new Error('Failed to read nil.system.json')
    }
  }

  return { getSystemMarker, isSystemRoot, getPackageType, getSystemName }
}
