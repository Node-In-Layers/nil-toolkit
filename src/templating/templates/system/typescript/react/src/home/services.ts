import { ServicesContext } from '@node-in-layers/core'
import { SystemConfig } from '../types.js'
import { HomeServices } from './types.js'

const create = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: ServicesContext<SystemConfig>
) : HomeServices => {
  return {
  }
}

export { create }