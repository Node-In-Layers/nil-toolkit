import { createClient as createMcpClient } from '@node-in-layers/mcp-client'
import { System } from '../system/types.js'

export const createClient = createMcpClient<System>
