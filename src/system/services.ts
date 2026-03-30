import path from 'node:path'
import { Config, CrossLayerProps, ServicesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { SystemServices } from './types.js'

export const create = (context: ServicesContext<Config>): SystemServices => {
  const linkSdkInPackage = (
    props: { systemName: string; packageName: string; sdkName: string },
    crossLayerProps?: CrossLayerProps
  ) => {
    context.services[Namespace.package].executeBashCommand(
      {
        packageName: path.join(props.systemName, props.packageName),
        command: `npm install ../${props.sdkName}`,
      },
      crossLayerProps
    )
  }

  return { linkSdkInPackage }
}
