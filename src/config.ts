import { Config, LogFormat, LogLevelNames } from '@node-in-layers/core'

const create = async (options: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}): Promise<Config> => {
  return {
    environment: 'prod',
    core: {
      apps: [
        await import('./package/index.js'),
        await import('./toolkit/index.js'),
      ],
      layerOrder: ['services', 'features'],
      logFormat: options.logFormat || LogFormat.simple,
      logLevel: options.logLevel || LogLevelNames.info,
    },
  }
}

export { create }
