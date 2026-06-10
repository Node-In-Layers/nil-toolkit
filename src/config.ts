import {
  Config,
  LogFormat,
  LogLevelNames,
  CoreNamespace,
} from '@node-in-layers/core'
import * as workspace from './workspace/index.js'
import * as templating from './templating/index.js'
import * as pkg from './package/index.js'
import * as domain from './domain/index.js'
import * as sdk from './sdk/index.js'
import * as backend from './backend/index.js'
import * as basic from './basic/index.js'
import * as frontend from './frontend/index.js'
import * as models from './models/index.js'
import * as system from './system/index.js'
import * as toolkit from './toolkit/index.js'

export const create = (options: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}): Config => {
  const config: Config = {
    environment: 'prod',
    systemName: 'nil-toolkit',
    [CoreNamespace.root]: {
      domains: [
        workspace,
        templating,
        pkg,
        domain,
        sdk,
        backend,
        basic,
        frontend,
        models,
        system,
        toolkit,
      ],
      layerOrder: ['services', 'features'],
      logging: {
        logFormat: options.logFormat || LogFormat.simple,
        logLevel: options.logLevel || LogLevelNames.trace,
      },
    },
  }
  return config
}
