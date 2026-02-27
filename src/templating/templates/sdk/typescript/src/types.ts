import { Config, XOR } from "@node-in-layers/core"
import type { OAuth2Config } from 'functional-models-orm-mcp'
import { McpClientNamespace, HttpConnection, CliConnection } from "@node-in-layers/mcp-client"

export type SdkBasicConfig = Readonly<{
  /**
   * This is the name of the overarching system that is using this client.
   * Either a CLI, or a frontend, or a backend.
   */
  name: string,
  environment: string,
  [McpClientNamespace.client]: {
    isBackend: boolean,
    mcp: {
      connection: XOR<HttpConnection, CliConnection>
    }
    credentials?: {
      header?: string
      key?: string
      formatter?: (key: string) => string
    }
    oauth2?: OAuth2Config
  }
  // Insert any of your additional configurations here.
}>

export type SdkConfig = SdkBasicConfig & Config
