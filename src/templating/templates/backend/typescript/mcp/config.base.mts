import { HttpConnection } from '@l4t/mcp-ai'
import {
  CoreNamespace,
  LogFormat,
} from '@node-in-layers/core/index.js'
import { DataNamespace } from '@node-in-layers/data/index.js'
import { LogLevelNames } from '@node-in-layers/core'
import { McpNamespace } from '@node-in-layers/mcp-server'
import { SystemConfig } from './src/types.js'

export default async (): Promise<SystemConfig> => {
  return {
    environment: 'base',
    systemName: '{{backendName}}',
    [CoreNamespace.root]: {
      apps: await Promise.all([
        import(`@node-in-layers/data/index.js`),
        import(`@node-in-layers/mcp-server/index.js`),
        // MCP should be before any local domains
        import (`./src/mcp/index.js`),
        import (`./src/health/index.js`),
      ]),
      layerOrder: ['services', 'features', ['entries', 'mcp']],
      logging: {
        logLevel: LogLevelNames.info,
        logFormat: LogFormat.json,
        ignoreLayerFunctions: {
          'mcp.mcp.addTool': true,
          'mcp.mcp.addUnprotectedRoute': true,
          'mcp.mcp.start': true,
          '@node-in-layers/data.express': true,
          '@node-in-layers/data.services': true,
          '@node-in-layers/data.features': true,
          '@node-in-layers/mcp-server.mcp': true,
        },
      },
      modelFactory: '@node-in-layers/data',
      modelCruds: true,
    },
    [DataNamespace.root]: {
      databases: {
        default: {
          datastoreType: 'memory',
        },
      },
    },
    [McpNamespace]: {
      stateless: true,
      server: {
        // @ts-ignore
        connection: {
          type: 'http',
          url: 'http://localhost',
          port: 3000,
        } as HttpConnection,
      },
    },
    mcp: {
      skipAuth: false,
    },
  }
}