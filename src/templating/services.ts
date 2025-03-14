import fs from 'node:fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'node:path'
import * as glob from 'glob'
import { ServicesContext } from '@node-in-layers/core'
import { PackageType } from '../package/types.js'
import { TemplatingServices, TemplatedFile } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const create = (context: ServicesContext): TemplatingServices => {
  const _getToolkitPackageJsonPath = async (): Promise<string | undefined> => {
    // Depending on if this is in a src or dist folder, this location will change.
    const wd = path.join(__dirname, '../**/package.json')
    return (await glob.glob(wd, { ignore: '../node_modules/**' })).find(
      p => fs.lstatSync(p).isFile() && p.endsWith('package.json')
    )
  }

  const getDependencyVersion = async (key: string) => {
    const packageJsonPath = await _getToolkitPackageJsonPath()
    if (!packageJsonPath) {
      throw new Error(`Could not find nil-toolkit's package.json file.`)
    }
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const value = packageJson.dependencies[key]
    if (!value) {
      throw new Error(`${key} does not exist inside package.json`)
    }
    return value
  }

  const createDirectory = (name: string, options?: { inSrc: boolean }) => {
    const parts = options?.inSrc
      ? [context.constants.workingDirectory, 'src', name]
      : [context.constants.workingDirectory, name]
    const fullPath = path.join(...parts)
    if (fs.existsSync(fullPath)) {
      throw new Error(`${fullPath} already exists. Must be a new directory.`)
    }
    fs.mkdirSync(fullPath)
  }

  const _readAllTemplateFiles = async (
    subDirectory: string,
    packageType: PackageType | 'all'
  ): Promise<readonly TemplatedFile[]> => {
    const templatePath = path.join(
      __dirname,
      `./templates/${subDirectory}/${packageType}/**/*`
    )
    const paths = (await glob.glob(templatePath, { dot: true })).filter(p =>
      fs.lstatSync(p).isFile()
    )
    return paths.map(sourceLocation => {
      const dirA = path.join(
        __dirname,
        `./templates/${subDirectory}/${packageType}`
      )
      const relativePath = path.relative(dirA, sourceLocation)
      const sourceData = fs.readFileSync(sourceLocation, 'utf-8')
      return {
        relativePath,
        sourceData,
      }
    })
  }

  const readTemplates = _readAllTemplateFiles

  const writeTemplates = (name, templates, options): void => {
    templates.forEach(t => {
      const pathParts = [
        context.constants.workingDirectory,
        ...(options?.ignoreNameInDir ? [] : [name]),
        t.relativePath,
      ]
      const finalLocation = path
        .join(...pathParts)
        .replaceAll('.handlebars', '')
        .replaceAll('PACKAGE_NAME', name)
        .replaceAll('APP_NAME', name)
        .replaceAll('SYSTEM_NAME', name)
      const dirPath = path.dirname(finalLocation)
      fs.mkdirSync(dirPath, { recursive: true })
      fs.writeFileSync(finalLocation, t.templatedData)
    })
  }

  return {
    createDirectory,
    readTemplates,
    writeTemplates,
    getDependencyVersion,
  }
}

export { create }
