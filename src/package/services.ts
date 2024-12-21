import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'node:path'
import exec from 'node:child_process'
import * as glob from 'glob'
import { ServicesDependencies } from '@node-in-layers/core'
import {
  FinalizedTemplate,
  PackageServices,
  TemplatedPackageFile,
} from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const create = (dependencies: ServicesDependencies): PackageServices => {
  const createPackageDirectory = (packageName: string) => {
    const fullPath = path.join(
      dependencies.constants.workingDirectory,
      packageName
    )
    if (dependencies.fs.existsSync(fullPath)) {
      throw new Error(`${fullPath} already exists. Must be a new directory.`)
    }
    dependencies.fs.mkdirSync(fullPath)
  }

  const _readAllTemplateFiles = async (
    subDirectory: string
  ): Promise<readonly TemplatedPackageFile[]> => {
    const templatePath = path.join(
      __dirname,
      `../templates/package/${subDirectory}/**/*`
    )
    const paths = (await glob.glob(templatePath, { dot: true })).filter(p =>
      dependencies.fs.lstatSync(p).isFile()
    )
    return paths.map(sourceLocation => {
      const dirA = path.join(__dirname, `../templates/package/${subDirectory}`)
      const relativePath = path.relative(dirA, sourceLocation)
      const sourceData = dependencies.fs.readFileSync(sourceLocation, 'utf-8')
      return {
        relativePath,
        sourceData,
      }
    })
  }

  const readGeneralTemplates = () => {
    return _readAllTemplateFiles('all')
  }

  const readTemplates = _readAllTemplateFiles

  const writeTemplates = (
    packageName: string,
    templates: readonly FinalizedTemplate[]
  ): void => {
    templates.forEach(t => {
      const finalLocation = path
        .join(
          dependencies.constants.workingDirectory,
          packageName,
          t.relativePath
        )
        .replaceAll('.handlebars', '')
        .replaceAll('PACKAGE_NAME', packageName)
      const dirPath = path.dirname(finalLocation)
      dependencies.fs.mkdirSync(dirPath, { recursive: true })
      dependencies.fs.writeFileSync(finalLocation, t.templatedData)
    })
  }

  const executeNpm = (
    packageName: string,
    command: string,
    args?: readonly string[]
  ) => {
    const cliArgs = args ? ` ${args.join(' ')}` : ''
    exec.execSync(`cd ${packageName} && npm ${command}${cliArgs}`, {
      stdio: 'inherit',
    })
  }

  return {
    createPackageDirectory,
    readTemplates,
    readGeneralTemplates,
    writeTemplates,
    executeNpm,
  }
}

export { create }
