import { Config, LogFormat, LogLevelNames } from '@node-in-layers/core'

const create = async (options: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}): Promise<Config> => {
  return {
    environment: 'prod',
    '@nil/core': {
      apps: [
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
