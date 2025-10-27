import { LayerContext } from "@node-in-layers/core"
import { SystemConfig } from "../types.js"

export type McpMcp = Readonly<{
  addCustomProtectedRoute: (path: string, method: string, authCallback?: (value: string) => boolean) => void
  addUnprotectedRoute: (path: string, method: string) => void
  start: (systemContext: LayerContext<SystemConfig, any>) => Promise<void>
}>