# Node In Layers Toolkit

The official tools for working with Node In Layers systems.

# How To Install

`npm i -g @node-in-layers/toolkit@latest`

# How to Use

Run `nil-toolkit` from the command line. It has the following commands.

- create-system - Creates a new Node In Layers System, complete with a config file and an executable shell.
- create-package - Creates a new reusable Node In Layers package.
- create-app - Creates a new app for an existing node in layers system/package. Must be executed from within the system/package.

## Commands

### create-system

This command creates a new Node In Layers system

### create-package

This command creates a new Node In Layers reusable package. This is similar to a system except, that it doesn't include the ability to run. It is intended to be used by 1 or more systems.

### create-app

This command creates a new app within a Node In Layers system/package.
