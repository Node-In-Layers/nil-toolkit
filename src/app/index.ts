import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import * as glob from 'glob'
import {
  FeaturesContext,
  Config,
  ServicesContext,
} from '@node-in-layers/core/index.js'
import { PackageServicesLayer, PackageType } from '../package/types.js'
import { Namespace } from '../types.js'
import { applyTemplates, createValidName } from '../templating/libs.js'
import { TemplatingServicesLayer } from '../templating/types.js'
import { AppServicesLayer, AppServices } from './types.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const services = {
  create: (deps: ServicesContext): AppServices => {
    const _getPackageJson = async (): Promise<string | undefined> => {
      const wd = `${deps.constants.workingDirectory}/package.json`
      return (await glob.glob(wd)).find(
        p => deps.node.fs.lstatSync(p).isFile() && p.endsWith('package.json')
      )
    }

    const isPackageRoot = async () => {
      const packageJson = await _getPackageJson()
      return Boolean(packageJson)
    }

    const doesAppAlreadyExist = appName => {
      const dirPath = path.join(__dirname, appName)
      return deps.node.fs.existsSync(dirPath)
    }

    const getPackageName = async () => {
      const packagePath = await _getPackageJson()
      if (!packagePath) {
        throw new Error(`package.json could not be found`)
      }
      const data = deps.node.fs.readFileSync(packagePath, 'utf-8')
      const asJson = JSON.parse(data)
      return asJson.name
    }

    const getPackageType = () =>
      Promise.resolve().then(() => {
        // TODO: Add support for non-typescript
        return PackageType.typescript
      })

    return {
      isPackageRoot,
      doesAppAlreadyExist,
      getPackageName,
      getPackageType,
    }
  },
}

const features = {
  create: (
    context: FeaturesContext<
      Config,
      PackageServicesLayer & AppServicesLayer & TemplatingServicesLayer
    >
  ) => {
    const createApp = async ({ appName }: { appName: string }) => {
      const ourServices = context.services[Namespace.app]
      const logger = context.log.getLogger('nil-toolkit:createApp')

      appName = createValidName(appName)

      if (!context.services[Namespace.app].isPackageRoot()) {
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
      const templates = await context.services[
        Namespace.templating
      ].readTemplates('app', packageType)
      logger.info('Apply Templates')
      const data = {
        nodeInLayersCoreVersion:
          await context.services[
            Namespace.templating
          ].getNodeInLayersCoreVersion(),
        packageName,
        appName,
      }
      const appliedTemplates = applyTemplates(templates, data)
      logger.info('Writing templates')
      context.services[Namespace.templating].writeTemplates(
        appName,
        appliedTemplates,
        { ignoreNameInDir: true }
      )
      logger.info('Operation complete')
    }
    return {
      createApp,
    }
  },
}

const name = Namespace.app
export { services, features, name }
