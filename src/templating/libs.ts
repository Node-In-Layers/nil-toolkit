import startCase from 'lodash/startCase.js'
import camelCase from 'lodash/camelCase.js'
import hb from 'handlebars'
import { FinalizedTemplate, TemplatedFile } from './types.js'

const _getProperty = (key: string, value?: string) => {
  if (!value) {
    return {}
  }
  return {
    [key]: value,
    [`${key}TitleCase`]: startCase(value).replaceAll(' ', ''),
  }
}

const applyTemplates = (
  templates: readonly TemplatedFile[],
  data: object & {
    nodeInLayersCoreVersion?: string
    versions?: Record<string, string>
    packageName?: string
    appName?: string
    systemName?: string
    domainName?: string
    sdkName?: string
    apiName?: string
    frontendName?: string
    apiType?: string
    framework?: string
  }
): readonly FinalizedTemplate[] => {
  const templateData = {
    ...data,
    ...(data.nodeInLayersCoreVersion
      ? { nodeInLayersCoreVersion: data.nodeInLayersCoreVersion }
      : {}),
    ...(data.versions || {}),
    ..._getProperty('packageName', (data as any).packageName),
    ..._getProperty('appName', (data as any).appName),
    ..._getProperty('systemName', (data as any).systemName),
    ..._getProperty('domainName', (data as any).domainName),
    ..._getProperty('sdkName', (data as any).sdkName),
    ..._getProperty('apiName', (data as any).apiName),
    ..._getProperty('frontendName', (data as any).frontendName),
  }
  return templates.map(t => {
    const fileTemplate = hb.compile(t.sourceData)
    const pathTemplate = hb.compile(t.relativePath)
    const templatedData = fileTemplate(templateData)
    const templatedPath = pathTemplate(templateData)
    return {
      relativePath: templatedPath,
      templatedData,
    }
  })
}

const createValidName = camelCase

export { applyTemplates, createValidName }
