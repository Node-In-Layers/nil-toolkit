import { Config } from '@node-in-layers/core'
import { McpServerConfig } from '@node-in-layers/mcp-server'
import { DataConfig } from '@node-in-layers/data'
import { AuthConfig } from '@node-in-layers/auth'
import { WithSecretsConfig } from '@node-in-layers/secrets'

export type SystemConfig = Config & DataConfig & McpServerConfig & AuthConfig & WithSecretsConfig & Readonly<object>
  // Insert additional configs here