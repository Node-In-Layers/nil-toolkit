import merge from 'lodash/merge.js'
import type { ClientBasicConfig } from '@node-in-layers/mcp-client'
import { McpClientNamespace } from '@node-in-layers/mcp-client'
import * as mcpDomain from '@node-in-layers/mcp-client/mcp/index.js'
import pkg from '../package.json' with { type: 'json' }
import * as client from './client/index.js'
import * as health from './health/index.js'
import { SdkBasicConfig } from './types.js'


export const create = async (
  config: SdkBasicConfig,
): Promise<ClientBasicConfig> => {

  const clientConfig: ClientBasicConfig = merge({
    name: config.name,
    environment: config.environment,
    [McpClientNamespace.client]: {
      domains: [
        client,
        mcpDomain,
        health
      ],
      version: pkg.version,
      ...config[McpClientNamespace.client],
    }
  }, config)

  return clientConfig
}

