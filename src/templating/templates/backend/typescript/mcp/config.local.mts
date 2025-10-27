import merge from 'lodash/merge.js'
import cloneDeep from 'lodash/cloneDeep.js'
import * as config from './config.base.mjs'
import {
  SystemConfig,
} from './src/types.js'

export default async (): Promise<SystemConfig> => {
  const instance = await config.default()
  const cloned = cloneDeep(instance)
  return merge(cloned, {
    environment: 'local',
    mcp: {
      skipAuth: true,
    }
  })
}
