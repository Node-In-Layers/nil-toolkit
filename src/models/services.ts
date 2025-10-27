import fs from 'node:fs'
import path from 'node:path'
import { ServicesContext } from '@node-in-layers/core'

import { ModelsServices } from './types.js'

export const create = (context: ServicesContext): ModelsServices => {
  const _getDomainDir = (domainName: string) =>
    path.join(context.constants.workingDirectory, 'src', domainName)
  const _getModelsDir = (domainName: string) =>
    path.join(_getDomainDir(domainName), 'models')

  const doesDomainExist = ({ domainName }: { domainName: string }) => {
    const dir = _getDomainDir(domainName)
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()
  }

  const ensureModelsDirectory = ({ domainName }: { domainName: string }) => {
    const dir = _getModelsDir(domainName)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const ensureModelsIndex = ({ domainName }: { domainName: string }) => {
    const idx = path.join(_getModelsDir(domainName), 'index.ts')
    if (!fs.existsSync(idx)) {
      fs.writeFileSync(idx, '\n')
    }
  }

  const exportModelInIndex = ({
    domainName,
    pluralTitle,
  }: {
    domainName: string
    pluralTitle: string
  }) => {
    const idx = path.join(_getModelsDir(domainName), 'index.ts')
    const line = `export * as ${pluralTitle} from './${pluralTitle}.js'\n`
    const existing = fs.readFileSync(idx, 'utf-8')
    if (!existing.includes(line.trim())) {
      fs.appendFileSync(idx, line)
    }
  }

  const doesModelExist = ({
    domainName,
    pluralTitle,
  }: {
    domainName: string
    pluralTitle: string
  }) => {
    const filePath = path.join(_getModelsDir(domainName), `${pluralTitle}.ts`)
    return fs.existsSync(filePath)
  }

  const writeModelFile = ({
    domainName,
    pluralTitle,
    source,
  }: {
    domainName: string
    pluralTitle: string
    source: string
  }) => {
    const filePath = path.join(_getModelsDir(domainName), `${pluralTitle}.ts`)
    fs.writeFileSync(filePath, source)
  }

  const ensureTypesFile = ({ domainName }: { domainName: string }) => {
    const typesPath = path.join(_getDomainDir(domainName), 'types.ts')
    if (!fs.existsSync(typesPath)) {
      fs.writeFileSync(typesPath, '')
    }
  }

  const addTypeIfMissing = ({
    domainName,
    singularName,
    primaryKeyName,
    includeCreatedAt,
    includeUpdatedAt,
  }: {
    domainName: string
    singularName: string
    primaryKeyName: string
    includeCreatedAt: boolean
    includeUpdatedAt: boolean
  }) => {
    const typesPath = path.join(_getDomainDir(domainName), 'types.ts')
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
