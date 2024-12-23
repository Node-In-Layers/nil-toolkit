import kebabCase from 'lodash/kebabCase.js'
import merge from 'lodash/merge.js'
import startCase from 'lodash/startCase.js'
import { FinalizedTemplate, TemplatedFile } from '../package/types.js'
import { applyTemplates as packageApplyTemplates } from '../package/libs.js'

const applyTemplates = (
  templates: readonly TemplatedFile[],
  data: { appName: string; packageName: string }
): readonly FinalizedTemplate[] => {
  const appNameTitleCase = startCase(data.appName).replaceAll(' ', '')
  return packageApplyTemplates(
    templates,
    merge(data, {
      appNameTitleCase,
    })
  )
}

const createValidAppName = kebabCase

export { applyTemplates, createValidAppName }
