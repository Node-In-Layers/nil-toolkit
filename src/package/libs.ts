import {FinalizedTemplate, TemplatedPackageFile} from "./types.js"
import kebabCase from "lodash/kebabCase.js"
import startCase from 'lodash/startCase.js'
import hb from "handlebars"

const applyTemplates = (templates: readonly TemplatedPackageFile[], data: {packageName: string}) : readonly FinalizedTemplate[] => {
  const templateData = {
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

const createValidPackageName = (packageName: string) => {
  return kebabCase(packageName)
}


export {
  applyTemplates,
  createValidPackageName,
}
