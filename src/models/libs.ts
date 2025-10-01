import startCase from 'lodash/startCase.js'

export const simpleSingularize = (input: string) => {
  const lower = input.trim()
  if (/ies$/iu.test(lower)) {
    return lower.replace(/ies$/iu, 'y')
  }
  if (/sses$/iu.test(lower)) {
    return lower.replace(/ses$/iu, 's')
  }
  if (/s$/iu.test(lower)) {
    return lower.replace(/s$/iu, '')
  }
  return lower
}

export const toTitleNoSpaces = (value: string) =>
  startCase(value).replaceAll(' ', '')

export type ParseDataResult = Readonly<{
  pluralTitle: string
  singularTitle: string
  primaryKeyName: string
  includeCreatedAt: boolean
  includeUpdatedAt: boolean
}>

export const parseCreateModelData = (data: string): ParseDataResult => {
  const d = JSON.parse(data)
  const basePlural = d.pluralName || d.pluralTitle || ''
  const pluralTitle = toTitleNoSpaces(basePlural)
  const suggestedSingularBase = simpleSingularize(basePlural)
  const singularTitle = toTitleNoSpaces(
    d.singularTitle || d.singularName || suggestedSingularBase
  )
  const primaryKeyName = d.primaryKeyName ?? 'id'
  const includeCreatedAt = d.includeCreatedAt ?? true
  const includeUpdatedAt = d.includeUpdatedAt ?? true
  return {
    pluralTitle,
    singularTitle,
    primaryKeyName,
    includeCreatedAt,
    includeUpdatedAt,
  }
}

export const buildModelSource = (args: {
  moduleName: string
  pluralTitle: string
  singularTitle: string
  primaryKeyName: string
  includeCreatedAt: boolean
  includeUpdatedAt: boolean
}) => {
  const {
    moduleName,
    pluralTitle,
    singularTitle,
    primaryKeyName,
    includeCreatedAt,
    includeUpdatedAt,
  } = args
  const base = [`      ${primaryKeyName}: PrimaryKeyUuidProperty(),`]
  const withCreated = includeCreatedAt
    ? base.concat([`      createdAt: DatetimeProperty({ autoNow: true }),`])
    : base
  const props = includeUpdatedAt
    ? withCreated.concat([
        `      updatedAt: LastModifiedDateProperty({ autoNow: true }),`,
      ])
    : withCreated
  return `import {
  LastModifiedDateProperty,
  DatetimeProperty,
  PrimaryKeyUuidProperty,
} from 'functional-models'
import { ModelProps } from '@node-in-layers/core'
import { ${singularTitle} } from '../types.js'

export const create = ({ Model }: ModelProps) => {
  return Model<${singularTitle}>({
    pluralName: '${pluralTitle}',
    singularName: '${singularTitle}',
    namespace: '${moduleName}',
    primaryKeyName: '${primaryKeyName}',
    properties: {
${props.join('\n')}
    },
  })
}
`
}
