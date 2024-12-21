import kebabCase from 'lodash/kebabCase.js'
import camelCase from 'lodash/camelCase.js'
import {Command} from "./types.js"

const cliCommandToCommand = (command: string) : Command => {
  const theCommand = camelCase(command) as Command
  if (!Command[theCommand]) {
    throw new Error(`${command} is not valid`)
  }
  return theCommand
}

const commandToCliCommand = (command: Command) => {
  const name = kebabCase(command)
  return `./bin/nil-${name}.js`
}

export {
  cliCommandToCommand,
  commandToCliCommand,
}
