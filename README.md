# Node In Layers Toolkit

<img src="./public/nil.png" width="160" height="150" />

The official tool suite for working with Node In Layers systems.

## This is the best place to start with Node in Layers

The nil-toolkit is the recommended way to create Node in Layer systems, as well as appending new modules to them.

# How To Install

`npm i -g @node-in-layers/toolkit@latest`

# How to Use

Run `nil-toolkit` from the command line. It has the following commands.

- create-system - Creates a new Node In Layers System, complete with a config file and an executable shell.
- create-package - Creates a new reusable Node In Layers package.
- create-app - Creates a new module (formerly “app”) for an existing Node In Layers system/package. Must be executed from within the system/package.
- create-model - Creates a new model within an existing module.

## Commands

### create-system

This command creates a new Node In Layers system.

### create-package

This command creates a new Node In Layers reusable package. This is similar to a system except, that it doesn't include the ability to run. It is intended to be used by 1 or more systems.

### create-app (module)

This command creates a new module within a Node In Layers system/package.

### create-model

Create a new model within an existing module. Must be executed from the root of a Node In Layers system or package.

Usage:

```
nil-toolkit create-model <moduleName>
```

Interactive flow (when no -d provided):

- Asks: What is the plural name of the model?
- Asks: What is the singular name? (default derived from plural)
- Asks: What is the primary key name? (default: id)
- Asks: Include createdAt time? (default: true)
- Asks: Include updatedAt time? (default: true)

Non-interactive JSON data:

```
nil-toolkit create-model <moduleName> -d '{
  "pluralName": "Configurations",
  "singularName": "Configuration",         // optional; derived if omitted
  "primaryKeyName": "id",                  // optional; defaults to "id"
  "includeCreatedAt": true,                 // optional; defaults to true
  "includeUpdatedAt": true                  // optional; defaults to true
}'
```

What it does:

- Verifies the module directory exists under `./src/<moduleName>`
- Ensures `./src/<moduleName>/models/` exists
- Ensures/updates `./src/<moduleName>/models/index.ts`, adding `export * as PluralTitle from './PluralTitle.js'`
- Creates `./src/<moduleName>/models/PluralTitle.ts` with a model factory `create()` using `functional-models`
- Ensures `./src/<moduleName>/types.ts` exists and adds a `type <SingularTitle>` if missing, respecting createdAt/updatedAt selections
