import fs from 'node:fs'
import * as glob from 'glob'
import merge from 'lodash/merge.js'
import { CrossLayerProps, ServicesContext } from '@node-in-layers/core/index.js'
import { PackageType } from '../templating/types.js'
import { SystemJson, WorkspaceServices } from './types.js'

export const create = (context: ServicesContext): WorkspaceServices => {
  const getSystemMarker = async (
    props?: { inPath?: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    crossLayerProps?: CrossLayerProps
  ): Promise<string | undefined> => {
    const wd = `${props?.inPath || context.constants.workingDirectory}/nil.system.json`
    return (await glob.glob(wd)).find(p => fs.existsSync(p))
  }

  const isSystemRoot = async (
    props?: { inPath?: string },
    crossLayerProps?: CrossLayerProps
  ) => Boolean(await getSystemMarker(props, crossLayerProps))

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

  const setSdkName = async (props: { sdkName: string; inPath?: string }) => {
    if (!props.sdkName) {
      throw new Error('sdkName is required')
    }
    const marker = await getSystemMarker({ inPath: props.inPath })
    if (!marker) {
      throw new Error('nil.system.json not found in current directory')
    }
    const json = JSON.parse(fs.readFileSync(marker, 'utf-8'))
    fs.writeFileSync(
      marker,
      JSON.stringify({ ...json, sdkName: props.sdkName }, null, 2)
    )
  }

  const addBackendName = async (props: {
    backendName: string
    inPath?: string
  }) => {
    if (!props.backendName) {
      throw new Error('backendName is required')
    }
    const marker = await getSystemMarker({ inPath: props.inPath })
    if (!marker) {
      throw new Error('nil.system.json not found in current directory')
    }
    const json = JSON.parse(fs.readFileSync(marker, 'utf-8'))
    const newJson = json.backends
      ? [...json.backends, props.backendName]
      : [props.backendName]
    const finalJson = merge(json, { backends: newJson })
    fs.writeFileSync(marker, JSON.stringify(finalJson, null, 2))
  }

  const addFrontendName = async (props: {
    frontendName: string
    inPath?: string
  }) => {
    if (!props.frontendName) {
      throw new Error('frontendName is required')
    }
    const marker = await getSystemMarker({ inPath: props.inPath })
    if (!marker) {
      throw new Error('nil.system.json not found in current directory')
    }
    const json = JSON.parse(fs.readFileSync(marker, 'utf-8'))
    const newJson = json.frontends
      ? [...json.frontends, props.frontendName]
      : [props.frontendName]
    const finalJson = merge(json, { frontends: newJson })
    fs.writeFileSync(marker, JSON.stringify(finalJson, null, 2))
  }

  const getSystemName = async (
    _props?: { inPath?: string },
    crossLayerProps?: CrossLayerProps
  ): Promise<string> => {
    const marker = await getSystemMarker(_props, crossLayerProps)
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
  const getSystemJson = async (props?: {
    inPath?: string
  }): Promise<SystemJson> => {
    const marker = await getSystemMarker(props)
    if (!marker) {
      throw new Error('nil.system.json not found in current directory')
    }
    return JSON.parse(fs.readFileSync(marker, 'utf-8'))
  }

  return {
    getSystemMarker,
    isSystemRoot,
    getPackageType,
    getSystemName,
    setSdkName,
    addBackendName,
    addFrontendName,
    getSystemJson,
  }
}
