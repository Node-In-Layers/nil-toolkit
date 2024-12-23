import fs from 'node:fs'
import * as core from '@node-in-layers/core'
import { LogFormat, LogLevelNames } from '@node-in-layers/core'
import { create as createConfig } from './config.js'

const loadSystem = async (args: {
  logFormat?: LogFormat
  logLevel?: LogLevelNames
}) => {
  const coreServices = core.services.create({
    fs,
    environment: 'prod',
    workingDirectory: process.cwd(),
  })
  const features = core.features.create({
    services: {
      ['nil-core/core']: coreServices,
    },
  })
  return features.loadSystem(await createConfig(args))
}

export { loadSystem }
