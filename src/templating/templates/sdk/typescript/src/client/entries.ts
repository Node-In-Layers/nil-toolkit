import { createClient as createMcpClient, ClientBasicConfig } from '@node-in-layers/mcp-client'
import { System } from '../system/types.js'

export const create = () => {
  const createClient = (props: ClientBasicConfig) => {
    return createMcpClient<System>({ config: props })
  }

  return {
    createClient,
  }
}
