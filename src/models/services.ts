import fs from 'node:fs'
import path from 'node:path'
import { ServicesContext } from '@node-in-layers/core'

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

  return {
    doesDomainExist,
    doesModelExist,
    ensureModelsDirectory,
    ensureModelsIndex,
    exportModelInIndex,
    writeModelFile,
    ensureTypesFile,
    addTypeIfMissing,
  }
}
