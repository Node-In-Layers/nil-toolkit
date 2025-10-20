import { Config, CoreNamespace } from '@node-in-layers/core'

type OmitNested<T, K1 extends keyof T, K2 extends keyof T[K1]> = Omit<T, K1> & {
  [P in K1]: Omit<T[K1], K2>
}

/**
 * The configuration that comes directly from the source code. (Much of the config
 * is provided elsewhere.)
 */
export type LocalConfig = OmitNested<Config, CoreNamespace.root, 'apps'> &
  Readonly<{
    environment: string 
  }>

/**
 * The actual application's configuration. Use this throughout the system.
 */
export type AppConfig = Config &
  LocalConfig & {
    // Insert custom configurations that happen in config.
  }
