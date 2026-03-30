import fs from 'node:fs'
import path from 'node:path'
import { ServicesContext } from '@node-in-layers/core'

import type { SystemJson } from '../workspace/types.js'
import { ModelsServices } from './types.js'

export const create = (context: ServicesContext): ModelsServices => {
  const _getDomainDir = (sdkName: string, domainName: string) => {
    return path.join(
      context.constants.workingDirectory,
      sdkName,
      'src',
      domainName
    )
  }

  const _getModelsDir = (sdkName: string, domainName: string) =>
    path.join(_getDomainDir(sdkName, domainName), 'models')

  const doesDomainExist = ({
    sdkName,
    domainName,
  }: {
    sdkName: string
    domainName: string
  }) => {
    const dir = _getDomainDir(sdkName, domainName)
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()
  }

  const ensureModelsDirectory = ({
    sdkName,
    domainName,
  }: {
    sdkName: string
    domainName: string
  }) => {
    const dir = _getModelsDir(sdkName, domainName)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const ensureModelsIndex = ({
    sdkName,
    domainName,
  }: {
    sdkName: string
    domainName: string
  }) => {
    const idx = path.join(_getModelsDir(sdkName, domainName), 'index.ts')
    if (!fs.existsSync(idx)) {
      fs.writeFileSync(idx, '\n')
    }
  }

  const exportModelInIndex = ({
    sdkName,
    domainName,
    pluralTitle,
  }: {
    sdkName: string
    domainName: string
    pluralTitle: string
  }) => {
    const idx = path.join(_getModelsDir(sdkName, domainName), 'index.ts')
    const line = `export * as ${pluralTitle} from './${pluralTitle}.js'\n`
    const existing = fs.readFileSync(idx, 'utf-8')
    if (!existing.includes(line.trim())) {
      fs.appendFileSync(idx, line)
    }
  }

  const doesModelExist = ({
    sdkName,
    domainName,
    pluralTitle,
  }: {
    sdkName: string
    domainName: string
    pluralTitle: string
  }) => {
    const filePath = path.join(
      _getModelsDir(sdkName, domainName),
      `${pluralTitle}.ts`
    )
    return fs.existsSync(filePath)
  }

  const writeModelFile = ({
    sdkName,
    domainName,
    pluralTitle,
    source,
  }: {
    sdkName: string
    domainName: string
    pluralTitle: string
    source: string
  }) => {
    const filePath = path.join(
      _getModelsDir(sdkName, domainName),
      `${pluralTitle}.ts`
    )
    fs.writeFileSync(filePath, source)
  }

  const ensureTypesFile = ({
    sdkName,
    domainName,
  }: {
    sdkName: string
    domainName: string
  }) => {
    const typesPath = path.join(_getDomainDir(sdkName, domainName), 'types.ts')
    if (!fs.existsSync(typesPath)) {
      fs.writeFileSync(typesPath, '')
    }
  }

  const addTypeIfMissing = ({
    sdkName,
    domainName,
    singularName,
    primaryKeyName,
    includeCreatedAt,
    includeUpdatedAt,
  }: {
    sdkName: string
    domainName: string
    singularName: string
    primaryKeyName: string
    includeCreatedAt: boolean
    includeUpdatedAt: boolean
  }) => {
    const typesPath = path.join(_getDomainDir(sdkName, domainName), 'types.ts')
    const content = fs.readFileSync(typesPath, 'utf-8')
    const typeName = singularName
    const signature = `export type ${typeName} =`
    if (content.includes(signature)) {
      return
    }
    const fields: string[] = [`  ${primaryKeyName}: string,`]
    const withCreated = includeCreatedAt
      ? fields.concat(['  createdAt?: string'])
      : fields
    const withUpdated = includeUpdatedAt
      ? withCreated.concat(['  updatedAt?: string'])
      : withCreated
    const typeDef = `export type ${typeName} = Readonly<{\n${withUpdated.join('\n')}\n}>\n`
    const needsDouble = !content.endsWith('\n')
    const separator = needsDouble ? '\n\n' : '\n'
    fs.appendFileSync(typesPath, `${separator}${typeDef}`)
  }

  const ensureSdkDomainModelsExport = (
    props: Readonly<{ domainName: string; systemJson: SystemJson }>
  ) => {
    const { domainName, systemJson } = props
    const sdkName = systemJson.sdkName ?? '.'
    const idx = path.join(_getDomainDir(sdkName, domainName), 'index.ts')
    if (!fs.existsSync(idx)) {
      return
    }
    const marker = 'export * as models from'
    const content = fs.readFileSync(idx, 'utf8')
    if (content.includes(marker)) {
      return
    }
    const line = `export * as models from './models/index.js'`
    const needsNl = content.length > 0 && !content.endsWith('\n')
    fs.appendFileSync(idx, `${needsNl ? '\n' : ''}${line}\n`)
  }

  const ensureBackendDomainModelsExport = (
    props: Readonly<{ domainName: string; systemJson: SystemJson }>
  ) => {
    const { domainName, systemJson } = props
    const backends: readonly string[] = systemJson.backends ?? []
    const sdkName = systemJson.sdkName ?? '.'
    const sdkDomainIndexPath = path.normalize(
      path.join(_getDomainDir(sdkName, domainName), 'index.ts')
    )
    const fullSdkPackageName =
      sdkName === '.'
        ? ''
        : (() => {
            const raw = systemJson.name
            const systemPrefix = raw.startsWith('@') ? raw : `@${raw}`
            return `${systemPrefix}/${sdkName}`
          })()

    const backendOnlyBlock = `export * as models from './models/index.js'`
    const sdkBackendBlock = `import { ${domainName} } from '${fullSdkPackageName}'\nexport const models = ${domainName}.models\n`

    backends.reduce<void>((_, backendName) => {
      const base = context.constants.workingDirectory
      const backendRoot =
        backendName === '.' ? base : path.join(base, backendName)
      const idx = path.normalize(
        path.join(backendRoot, 'src', domainName, 'index.ts')
      )
      if (!fs.existsSync(idx)) {
        return undefined
      }
      if (sdkName === '.' && idx === sdkDomainIndexPath) {
        return undefined
      }
      const content = fs.readFileSync(idx, 'utf8')
      if (sdkName === '.') {
        if (content.includes('export * as models from')) {
          return undefined
        }
        const needsNl = content.length > 0 && !content.endsWith('\n')
        fs.appendFileSync(idx, `${needsNl ? '\n' : ''}${backendOnlyBlock}\n`)
        return undefined
      }
      if (
        content.includes('export const models =') ||
        content.includes(
          `import { ${domainName} } from '${fullSdkPackageName}'`
        )
      ) {
        return undefined
      }
      const needsNl = content.length > 0 && !content.endsWith('\n')
      fs.appendFileSync(idx, `${needsNl ? '\n' : ''}${sdkBackendBlock}`)
      return undefined
    }, undefined)
  }

  return {
    doesDomainExist,
    doesModelExist,
    ensureModelsDirectory,
    ensureModelsIndex,
    exportModelInIndex,
    writeModelFile,
    ensureTypesFile,
    addTypeIfMissing,
    ensureSdkDomainModelsExport,
    ensureBackendDomainModelsExport,
  }
}
