import { Config } from "@node-in-layers/core"
import type { HttpConnection, SseConnection, CliConnection } from '@l4t/mcp-ai'
import type { OAuth2Config } from 'functional-models-orm-mcp'
import { McpClientNamespace } from "@node-in-layers/mcp-client"


export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

export type XOR<A, B> = A | B extends object
  ? (Without<A, B> & B) | (Without<B, A> & A)
  : A | B

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
      connection: XOR<XOR<HttpConnection, SseConnection>, CliConnection>
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
