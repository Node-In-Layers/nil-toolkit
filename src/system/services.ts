import fs from 'node:fs'
import path from 'node:path'
import { Config, CrossLayerProps, ServicesContext } from '@node-in-layers/core'
import { Namespace } from '../types.js'
import { SystemServices } from './types.js'

export const create = (context: ServicesContext<Config>): SystemServices => {
  const ensureSystemDirectory = (props: { systemName: string }) => {
    const root = path.join(context.constants.workingDirectory, props.systemName)
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root)
    }
  }

  const writeSystemMarker = (
    props: { systemName: string; description: string },
    crossLayerProps?: CrossLayerProps
  ) => {
    const markerData = [
      {
        relativePath: 'nil.system.json',
        templatedData: JSON.stringify(
          { name: props.systemName, description: props.description },
          null,
          2
        ),
      },
    ]
    context.services[Namespace.templating].writeTemplates(
      {
        packageName: '.',
        templates: markerData as any,
        options: { ignoreNameInDir: true, baseDirName: props.systemName },
      },
      crossLayerProps
    )
  }

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

  return { ensureSystemDirectory, writeSystemMarker, linkSdkInPackage }
}
