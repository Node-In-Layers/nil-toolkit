import { ServicesContext } from '@node-in-layers/core'
import { AppConfig } from '../types.js'
import { HomeServices } from './types.js'

const create = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: ServicesContext<AppConfig>
) : HomeServices => {
  return {
  }
}

export { create }