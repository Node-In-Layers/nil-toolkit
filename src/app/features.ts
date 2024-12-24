import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import * as glob from 'glob'
import { AppServicesLayer, AppServices } from './types.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const create = (deps): AppServices => {
  const _getPackageJson = async (): Promise<string | undefined> => {
    const wd = `${deps.constants.workingDirectory}/package.json`
    return (await glob.glob(wd)).find(
      p => deps.fs.lstatSync(p).isFile() && p.endsWith('package.json')
    )
  }

  const isPackageRoot = async () => {
    const packageJson = await _getPackageJson()
    return Boolean(packageJson)
  }

  const doesAppAlreadyExist = appName => {
    const dirPath = path.join(__dirname, appName)
    return deps.fs.existsSync(dirPath)
  }

  const getPackageName = async () => {
    const packagePath = await _getPackageJson()
    if (!packagePath) {
      throw new Error(`package.json could not be found`)
    }
    const data = deps.fs.readFileSync(packagePath, 'utf-8')
    const asJson = JSON.parse(data)
    return asJson.name
  }

  const getPackageType = () =>
    Promise.resolve().then(() => {
      // TODO: Add support for non-typescript
      return PackageType.typescript
    })

  const readTemplates = async ({ packageType }) => {
    const templatePath = path.join(
      __dirname,
      `../templates/app/${packageType}/src/**/*`
    )
    const paths = (await glob.glob(templatePath, { dot: true })).filter(p =>
      deps.fs.lstatSync(p).isFile()
    )
    return paths.map(sourceLocation => {
      const dirA = path.join(__dirname, `../templates/app/${packageType}`)
      const relativePath = path.relative(dirA, sourceLocation)
      const sourceData = deps.fs.readFileSync(sourceLocation, 'utf-8')
      return {
        relativePath,
        sourceData,
      }
    })
  }

  const writeTemplates = (appName, templates) => {
    templates.forEach(t => {
      const finalLocation = path
        .join(deps.constants.workingDirectory, t.relativePath)
        .replaceAll('.handlebars', '')
        .replaceAll('APP_NAME', appName)
      const dirPath = path.dirname(finalLocation)
      deps.fs.mkdirSync(dirPath, { recursive: true })
      deps.fs.writeFileSync(finalLocation, t.templatedData)
    })
  }

  return {
    isPackageRoot,
    doesAppAlreadyExist,
    getPackageName,
    getPackageType,
    readTemplates,
    writeTemplates,
  }
}

export {
  create,
}
