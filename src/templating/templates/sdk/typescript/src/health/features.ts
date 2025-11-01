import { FeaturesContext } from '@node-in-layers/core/index.js'
import type { McpServicesLayer } from '@node-in-layers/mcp-client/mcp/types.js'
import { McpClientNamespace } from '@node-in-layers/mcp-client'
import { SdkConfig } from '../types.js'
import { GetHealthProps, HealthFeatures } from './types.js'

const create = (
  context: FeaturesContext<SdkConfig, McpServicesLayer>
): HealthFeatures => {
  const getHealth = context.services[McpClientNamespace.mcp].createMcpFeature(GetHealthProps)

  return {
    getHealth,
  }
}

export { create }
