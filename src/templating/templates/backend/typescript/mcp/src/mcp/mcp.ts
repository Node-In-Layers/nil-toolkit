import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express'
import { LayerContext } from '@node-in-layers/core'
import { McpContext, McpNamespace } from '@node-in-layers/mcp-server'
import { ExpressMiddleware, ExpressOptions } from '@l4t/mcp-ai'
import { SystemConfig } from '../types.js'
import { McpMcp } from './types.js'

const NOT_AUTHORIZED = 401

const create = (
  context: McpContext<
    SystemConfig
  >
): McpMcp => {
  const _protectedRoutes: {
    path: string
    method: string
    authCallback?: (value: string) => boolean
  }[] = []
  const _unprotectedRoutes: {
    path: string
    method: string
  }[] = []

  const _protectedMiddleware: ExpressMiddleware = async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) => {
    // Is this a route that is protected, but in a different way?
    const route = _protectedRoutes.find(
      route => route.path === req.path && route.method === req.method
    )
    if (route) {
      if (route.authCallback) {
        const result = await route.authCallback(req.headers.authorization)
        if (!result) {
          res.status(NOT_AUTHORIZED).json({
            error: {
              code: 'NOT_AUTHORIZED',
              message: 'Unauthorized',
              details: 'The request was not authorized.',
            }
          })
          return
        }
      }
      next()
      return
    }

    // Is this a route that we don't need to protect?
    const unprotectedRoute = _unprotectedRoutes.find(
      route => route.path === req.path && route.method === req.method
    )
    if (unprotectedRoute) {
      next()
      return
    }

    // Run your normal protected route
    // Example:
    // return context.features.auth.authMiddleware(req, res, next)
    next()
    return
  }

  // If we want authorization, then we add the protected middleware above.
  if (!context.config.mcp.skipAuth) {
    context.mcp[McpNamespace].addPreRouteMiddleware(_protectedMiddleware)
  }

  /**
   * Adds a custom route that should be protected.
   * @param path The express path of the route.
   * @param method Which method to expose.
   * @param authCallback Custom authorization pathway. Useful for things like protecting a normally Oauth2 system with api keys.
   */
  const addCustomProtectedRoute = (
    path: string,
    method: string,
    authCallback?: (value: string) => boolean
  ) => {
    // eslint-disable-next-line functional/immutable-data
    _protectedRoutes.push({ path, method, authCallback })
  }

  /**
   * Adds a route that should not be protected at all.
   * @param path The express path
   * @param method The http method
   */
  const addUnprotectedRoute = (path: string, method: string) => {
    // eslint-disable-next-line functional/immutable-data
    _unprotectedRoutes.push({ path, method })
  }

  /**
   * Starts the MCP server.
   * @param systemContext The full system context.
   */
  const start = async (systemContext: LayerContext<SystemConfig, any>) => {
    const options: ExpressOptions = {
      jsonBodyParser: {
        // Set your json payload max size.
        limit: '100mb',
      },
    }
    await context.mcp[McpNamespace].start(systemContext, options)
  }

  return {
    addCustomProtectedRoute,
    addUnprotectedRoute,
    start,
  }
}

export { create }