import { McpServerMcpLayer } from '@node-in-layers/mcp-server'
import { HealthFeaturesLayer } from '../health/types.js'

/**
 * This is the overall type for the context.
 */
export type System = Readonly<{
  services: object 
  features: HealthFeaturesLayer
  mcp: McpServerMcpLayer
}>