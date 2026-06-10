import { CrossLayerProps } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { TemplatingServicesLayer } from './types.js'

export const toTemplateVersionKey = (pkg: string): string => {
  const normalized = pkg
    .replace(/^@node-in-layers\//u, 'nodeInLayers/')
    .replace(/^@/u, '')
  const parts = normalized.split(/[-/]/u)
  const camel = parts
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join('')
  return `${camel}Version`
}

export const TEMPLATE_OVERRIDES = {
  'external-editor': {
    tmp: '>=0.2.6',
  },
  commitizen: {
    lodash: '>=4.17.24',
    inquirer: {
      'external-editor': {
        tmp: '>=0.2.6',
      },
    },
  },
  mocha: {
    diff: '>=8.0.3',
    'serialize-javascript': '>=7.0.5',
  },
  sinon: {
    diff: '>=8.0.3',
  },
  '@cucumber/cucumber': {
    tmp: '>=0.2.6',
  },
} as const

export const getOverridesJson = (): string => {
  const json = JSON.stringify(TEMPLATE_OVERRIDES, null, 2)
  return json
    .split('\n')
    .map((line, index) =>
      index === 0 ? `  "overrides": ${line}` : `  ${line}`
    )
    .join('\n')
    .concat(',')
}

export const NIL_CORE = ['@node-in-layers/core'] as const

export const NIL_BASIC = [
  '@node-in-layers/core',
  '@node-in-layers/data',
  '@node-in-layers/secrets',
] as const

export const NIL_BACKEND = [
  ...NIL_BASIC,
  '@node-in-layers/mcp-server',
  '@node-in-layers/auth',
] as const

export const NIL_SDK = [
  '@node-in-layers/core',
  '@node-in-layers/mcp-client',
  '@node-in-layers/rest-client',
] as const

export const NIL_FRONTEND = [
  '@node-in-layers/core',
  '@node-in-layers/mcp-client',
] as const

export const COMMON_RUNTIME = [
  'functional-models',
  'functional-models-orm-mcp',
  'argparse',
  'chalk',
  'es-main',
  'lodash',
  'express',
  'zod',
] as const

export const COMMON_DEV = [
  '@cucumber/cucumber',
  '@eslint/compat',
  '@eslint/eslintrc',
  '@eslint/js',
  '@types/chai-as-promised',
  '@types/json-stringify-safe',
  '@types/lodash',
  '@types/mocha',
  '@types/node',
  '@types/proxyquire',
  '@types/sinon',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  '@typescript/native-preview',
  'c8',
  'chai',
  'chai-as-promised',
  'cz-conventional-changelog',
  'eslint',
  'eslint-config-prettier',
  'eslint-import-resolver-typescript',
  'eslint-plugin-functional',
  'eslint-plugin-import',
  'esprima',
  'fetch-blob',
  'globals',
  'js-yaml',
  'json5',
  'mocha',
  'nodemon',
  'prettier',
  'proxyquire',
  'sinon',
  'sinon-chai',
  'source-map-support',
  'ts-node',
  'tsx',
  'typescript',
] as const

export const FRONTEND_RUNTIME = [
  '@emotion/react',
  '@emotion/styled',
  '@mui/icons-material',
  '@mui/material',
  'es-main',
  'react',
  'react-dom',
  'react-router',
] as const

export const FRONTEND_DEV = [
  '@types/react',
  '@types/react-dom',
  '@vitejs/plugin-react',
  'eslint-plugin-react-hooks',
  'eslint-plugin-react-refresh',
  'handlebars',
  'typescript-eslint',
  'vite',
] as const

type BuildTemplateVersionsContext = {
  services: TemplatingServicesLayer
}

export const buildTemplateVersions = async (
  context: BuildTemplateVersionsContext,
  props: { include: readonly string[]; includeOverrides?: boolean },
  crossLayerProps?: CrossLayerProps
): Promise<Record<string, string>> => {
  const get = (key: string) =>
    context.services[Namespace.templating].getDependencyVersion(
      { key },
      crossLayerProps
    )

  const entries = await Promise.all(
    props.include.map(async key => {
      const version = await get(key)
      return [toTemplateVersionKey(key), version] as const
    })
  )

  const versions = Object.fromEntries(entries) as Record<string, string>

  if (props.includeOverrides === false) {
    return versions
  }

  return {
    ...versions,
    overridesJson: getOverridesJson(),
  }
}
