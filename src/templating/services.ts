import fs from 'node:fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'node:path'
import * as glob from 'glob'
import { ServicesContext } from '@node-in-layers/core'
import {
  FinalizedTemplate,
  PackageType,
  TemplatingServices,
  TemplatedFile,
} from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const create = (context: ServicesContext): TemplatingServices => {
  const _getToolkitPackageJsonPath = async (): Promise<string | undefined> => {
    // Depending on if this is in a src or dist folder, this location will change.
    const wd = path.join(__dirname, '../**/package.json')
    return (await glob.glob(wd, { ignore: '../node_modules/**' })).find(
      p => fs.lstatSync(p).isFile() && p.endsWith('package.json')
    )
  }

  const getDependencyVersion = async (props: { key: string }) => {
    const packageJsonPath = await _getToolkitPackageJsonPath()
    if (!packageJsonPath) {
      throw new Error(`Could not find nil-toolkit's package.json file.`)
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const value = packageJson.dependencies[props.key]
    if (!value) {
      throw new Error(`${props.key} does not exist inside package.json`)
    }
    return value
  }

  const createDirectory = (props: {
    name: string
    options?: { inSrc: boolean }
  }) => {
    const parts = props.options?.inSrc
      ? [context.constants.workingDirectory, 'src', props.name]
      : [context.constants.workingDirectory, props.name]
    const fullPath = path.join(...parts)
    if (fs.existsSync(fullPath)) {
      throw new Error(`${fullPath} already exists. Must be a new directory.`)
    }
    fs.mkdirSync(fullPath)
  }

  const readTemplates = async (props: {
    name: string
    packageType: PackageType | 'all'
    nested?: string
  }): Promise<readonly TemplatedFile[]> => {
    const templatePath = props.nested
      ? path.join(
          __dirname,
          `./templates/${props.name}/${props.packageType}/${props.nested}/**/*`
        )
      : path.join(
          __dirname,
          `./templates/${props.name}/${props.packageType}/**/*`
        )
    const paths = (await glob.glob(templatePath, { dot: true })).filter(p =>
      fs.lstatSync(p).isFile()
    )
    return paths.map(sourceLocation => {
      const dirA = path.join(
        __dirname,
        props.nested
          ? `./templates/${props.name}/${props.packageType}/${props.nested}`
          : `./templates/${props.name}/${props.packageType}`
      )
      const relativePath = path.relative(dirA, sourceLocation)
      const sourceData = fs.readFileSync(sourceLocation, 'utf-8')
      return {
        relativePath,
        sourceData,
      }
    })
  }

  const writeTemplates = (props: {
    packageName: string
    templates: readonly Required<FinalizedTemplate>[]
    options?: { ignoreNameInDir?: boolean }
  }): void => {
    props.templates.forEach(t => {
      const pathParts = [
        context.constants.workingDirectory,
        ...(props.options?.ignoreNameInDir ? [] : [props.packageName]),
        t.relativePath,
      ]
      const finalLocation = path
        .join(...pathParts)
        .replaceAll('.handlebars', '')
        .replaceAll('PACKAGE_NAME', props.packageName)
        .replaceAll('APP_NAME', props.packageName)
        .replaceAll('SYSTEM_NAME', props.packageName)
      const dirPath = path.dirname(finalLocation)
      fs.mkdirSync(dirPath, { recursive: true })
      fs.writeFileSync(finalLocation, t.templatedData as string)
    })
  }

  return {
    createDirectory,
    readTemplates,
    writeTemplates,
    getDependencyVersion,
  }
}
