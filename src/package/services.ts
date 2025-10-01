import exec from 'node:child_process'
import { PackageServices } from './types.js'

export const create = (): PackageServices => {
  const executeNpm = (props: {
    packageName: string
    command: string
    args?: readonly string[]
  }) => {
    const cliArgs = props.args ? ` ${props.args.join(' ')}` : ''
    exec.execSync(`cd ${props.packageName} && npm ${props.command}${cliArgs}`, {
      stdio: 'inherit',
    })
  }

  const executeBashCommand = (props: {
    packageName: string
    command: string
    args?: readonly string[]
  }) => {
    const cliArgs = props.args ? ` ${props.args.join(' ')}` : ''
    exec.execSync(`cd ${props.packageName} && ${props.command}${cliArgs}`, {
      stdio: 'inherit',
    })
  }

  return {
    executeNpm,
    executeBashCommand,
  }
}
