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
    [CoreNamespace.root]: {
      apps: [
        await import('./templating/index.js'),
        await import('./package/index.js'),
        await import('./app/index.js'),
        await import('./system/index.js'),
        await import('./toolkit/index.js'),
      ],
      layerOrder: ['services', 'features'],
      logFormat: options.logFormat || LogFormat.simple,
      logLevel: options.logLevel || LogLevelNames.info,
    },
  }
}

export { create }
