import {
  Config,
  LogFormat,
  LogLevelNames,
  CoreNamespace,
} from '@node-in-layers/core/index.js'

const create = async (options: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}): Promise<Config> => {
  return {
    environment: 'prod',
    systemName: 'nil-toolkit',
    [CoreNamespace.root]: {
      domains: [
        await import('./workspace/index.js'),
        await import('./templating/index.js'),
        await import('./package/index.js'),
        await import('./domain/index.js'),
        await import('./sdk/index.js'),
        await import('./backend/index.js'),
        await import('./frontend/index.js'),
        await import('./models/index.js'),
        await import('./system/index.js'),
        await import('./toolkit/index.js'),
      ],
      layerOrder: ['services', 'features'],
      logging: {
        logFormat: options.logFormat || LogFormat.simple,
        logLevel: options.logLevel || LogLevelNames.trace,
      },
    },
  }
}

export { create }
