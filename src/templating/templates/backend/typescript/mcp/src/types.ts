import { Config } from '@node-in-layers/core'
import { McpServerConfig } from '@node-in-layers/mcp-server'

export type SystemConfig = Config & McpServerConfig & Readonly<{
  mcp: {
    skipAuth?: boolean
  }
}>