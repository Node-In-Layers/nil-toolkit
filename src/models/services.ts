import fs from 'node:fs'
import path from 'node:path'
import { ServicesContext } from '@node-in-layers/core'

import { ModelsServices } from './types.js'

export const create = (context: ServicesContext): ModelsServices => {
  const _getModuleDir = (moduleName: string) =>
    path.join(context.constants.workingDirectory, 'src', moduleName)
  const _getModelsDir = (moduleName: string) =>
    path.join(_getModuleDir(moduleName), 'models')

  const doesModuleExist = ({ moduleName }: { moduleName: string }) => {
    const dir = _getModuleDir(moduleName)
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()
  }

  const ensureModelsDirectory = ({ moduleName }: { moduleName: string }) => {
    const dir = _getModelsDir(moduleName)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  const ensureModelsIndex = ({ moduleName }: { moduleName: string }) => {
    const idx = path.join(_getModelsDir(moduleName), 'index.ts')
    if (!fs.existsSync(idx)) {
      fs.writeFileSync(idx, '\n')
    }
  }

  const exportModelInIndex = ({
    moduleName,
    pluralTitle,
  }: {
    moduleName: string
    pluralTitle: string
  }) => {
    const idx = path.join(_getModelsDir(moduleName), 'index.ts')
    const line = `export * as ${pluralTitle} from './${pluralTitle}.js'\n`
    const existing = fs.readFileSync(idx, 'utf-8')
    if (!existing.includes(line.trim())) {
      fs.appendFileSync(idx, line)
    }
  }

  const doesModelExist = ({
    moduleName,
    pluralTitle,
  }: {
    moduleName: string
    pluralTitle: string
  }) => {
    const filePath = path.join(_getModelsDir(moduleName), `${pluralTitle}.ts`)
    return fs.existsSync(filePath)
  }

  const writeModelFile = ({
    moduleName,
    pluralTitle,
    source,
  }: {
    moduleName: string
    pluralTitle: string
    source: string
  }) => {
    const filePath = path.join(_getModelsDir(moduleName), `${pluralTitle}.ts`)
    fs.writeFileSync(filePath, source)
  }

  const ensureTypesFile = ({ moduleName }: { moduleName: string }) => {
    const typesPath = path.join(_getModuleDir(moduleName), 'types.ts')
    if (!fs.existsSync(typesPath)) {
      fs.writeFileSync(typesPath, '')
    }
  }

  const addTypeIfMissing = ({
    moduleName,
    singularName,
    primaryKeyName,
    includeCreatedAt,
    includeUpdatedAt,
  }: {
    moduleName: string
    singularName: string
    primaryKeyName: string
    includeCreatedAt: boolean
    includeUpdatedAt: boolean
  }) => {
    const typesPath = path.join(_getModuleDir(moduleName), 'types.ts')
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
    doesModuleExist,
    doesModelExist,
    ensureModelsDirectory,
    ensureModelsIndex,
    exportModelInIndex,
    writeModelFile,
    ensureTypesFile,
    addTypeIfMissing,
  }
}
