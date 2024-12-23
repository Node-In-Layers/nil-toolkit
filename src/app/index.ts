import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import * as glob from 'glob'
import { SimpleFeaturesDependencies } from '@node-in-layers/core/index.js'
import { PackageServicesLayer, PackageType } from '../package/types.js'
import { AppServicesLayer, AppServices } from './types.js'
import { applyTemplates, createValidAppName } from './libs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const services = {
  create: (deps): AppServices => {
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
  },
}

const features = {
  create: (
    deps: SimpleFeaturesDependencies<PackageServicesLayer & AppServicesLayer>
  ) => {
    const createApp = async ({ appName }: { appName: string }) => {
      const ourServices = deps.services['nil-toolkit/app']
      const logger = deps.log.getLogger('nil-toolkit:createApp')

      appName = createValidAppName(appName)

      if (!deps.services['nil-toolkit/app'].isPackageRoot()) {
        throw new Error(
          `Must be located in the main directory of your node-in-layers system or package. This is the same directory as the package.json.`
        )
      }

      logger.debug('Checking if package exists.')
      if (ourServices.doesAppAlreadyExist(appName)) {
        throw new Error(`App ${appName} already exists.`)
      }

      logger.info('Getting current package name')
      const packageName = await ourServices.getPackageName()
      logger.info(`Package name is ${packageName}`)
      logger.info('Getting package type')
      const packageType = await ourServices.getPackageType()
      logger.info(`Package Type if ${packageType}`)
      logger.info('Reading Templates')
      const templates = await ourServices.readTemplates({ packageType })
      logger.info('Apply Templates')
      const appliedTemplates = applyTemplates(templates, {
        packageName,
        appName,
      })
      logger.info('Writing templates')
      ourServices.writeTemplates(appName, appliedTemplates)
      logger.info('Operation complete')
    }
    return {
      createApp,
    }
  },
}

const name = 'nil-toolkit/app'
export { services, features, name }
