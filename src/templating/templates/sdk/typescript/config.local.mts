// This really is only used for examples, as well as for the shell. (local cli)
import { SdkBasicConfig } from './src/types.js'
import * as baseConfig from './config.base.mjs'

export default () : SdkBasicConfig => {
  return {
    ...baseConfig.default(),
    environment: 'local',
  }
}