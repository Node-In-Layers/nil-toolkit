import merge from 'lodash/merge.js'
import * as baseConfig from './config.base.js'

export default () => {
  const instance = baseConfig.default()
  return merge(instance, {
    environment: 'prod',
  })
}
