import * as core from '@node-in-layers/core'
import type { Config } from '@node-in-layers/core'
import { LogFormat, LogLevelNames } from '@node-in-layers/core'
import { create as createConfig } from './config.js'

const loadSystem = async (args: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}) => {
  const config: Config = createConfig(args)
  return core.loadSystem<Config>({
    environment: 'prod',
    config,
  })
}

export { loadSystem }
