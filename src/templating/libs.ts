import kebabCase from 'lodash/kebabCase.js'
import startCase from 'lodash/startCase.js'
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
    nodeInLayersCoreVersion: string
    packageName?: string
    appName?: string
    systemName?: string
  }
): readonly FinalizedTemplate[] => {
  const templateData = {
    ...data,
    nodeInLayersCoreVersion: data.nodeInLayersCoreVersion,
    ..._getProperty('packageName', data.packageName),
    ..._getProperty('appName', data.appName),
    ..._getProperty('systemName', data.appName),
  }
  return templates.map(t => {
    const template = hb.compile(t.sourceData)
    const templatedData = template(templateData)
    return {
      relativePath: t.relativePath,
      templatedData,
    }
  })
}

const createValidName = kebabCase

export { applyTemplates, createValidName }
