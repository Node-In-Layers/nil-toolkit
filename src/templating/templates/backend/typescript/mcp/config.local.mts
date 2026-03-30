import merge from 'lodash/merge.js'
import cloneDeep from 'lodash/cloneDeep.js'
import { AuthNamespace } from '@node-in-layers/auth'
import * as config from './config.base.mjs'
import {
  SystemConfig,
} from './src/types.js'

export default async (): Promise<SystemConfig> => {
  const instance = await config.default()
  const cloned = cloneDeep(instance)
  return merge(cloned, {
    environment: 'local',
    [AuthNamespace.Api]: {
      authentication: {
        skipAllAuthentication: true,
      }
    },
  })
}
