import { Config } from '@node-in-layers/core'
import { DataConfig } from '@node-in-layers/data'
import { WithSecretsConfig } from '@node-in-layers/secrets'

export type SystemConfig = Config &
  DataConfig &
  WithSecretsConfig &
  Readonly<object>
