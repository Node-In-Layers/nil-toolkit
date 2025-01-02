import * as core from '@node-in-layers/core'
import { LogFormat, LogLevelNames } from '@node-in-layers/core'
import { create as createConfig } from './config.js'

const loadSystem = async (args: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}) => {
  const config = await createConfig(args)
  return core.loadSystem({
    environment: 'prod',
    config,
  })
}

export { loadSystem }
