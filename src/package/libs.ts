import kebabCase from 'lodash/kebabCase.js'
import startCase from 'lodash/startCase.js'
import hb from 'handlebars'
import { FinalizedTemplate, TemplatedFile } from './types.js'

const applyTemplates = (
  templates: readonly TemplatedFile[],
  data: object & { packageName: string }
): readonly FinalizedTemplate[] => {
  const templateData = {
    ...data,
    packageName: data.packageName,
    packageNameTitleCase: startCase(data.packageName).replaceAll(' ', ''),
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

const createValidPackageName = kebabCase

export { applyTemplates, createValidPackageName }
