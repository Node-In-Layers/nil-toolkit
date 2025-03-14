import exec from 'node:child_process'
import { PackageServices } from './types.js'

const create = (): PackageServices => {
  const executeNpm = (
    packageName: string,
    command: string,
    args?: readonly string[]
  ) => {
    const cliArgs = args ? ` ${args.join(' ')}` : ''
    exec.execSync(`cd ${packageName} && npm ${command}${cliArgs}`, {
      stdio: 'inherit',
    })
  }

  const executeBashCommand = (
    packageName: string,
    command: string,
    args?: readonly string[]
  ) => {
    const cliArgs = args ? ` ${args.join(' ')}` : ''
    exec.execSync(`cd ${packageName} && ${command}${cliArgs}`, {
      stdio: 'inherit',
    })
  }

  return {
    executeNpm,
    executeBashCommand,
  }
}

export { create }
