# Node In Layers Toolkit

<img src="./public/nil.png" width="160" height="150" />

The official tool suite for working with Node In Layers systems.

## This is the best place to start with Node in Layers

The nil-toolkit is the recommended way to create Node in Layer systems, as well as appending new modules to them.

# How To Install

Install the tool globally and use it.

`npm i -g @node-in-layers/toolkit@latest`

# How to Use

Run `nil-toolkit` from the command line. It has the following commands.

## create-system

Creates a new complete Node In Layers System. This includes an sdk (for types and interfaces), a backend server, and a frontend. All using Node In Layers

## create-package

Creates a new reusable Node In Layers package.

## create-domain

Creates a new domain (formerly known as “app”) for an existing Node In Layers system/package. Must be executed from within the folder of a Node in Layer system. This will create the new domain in the SDK.

## create-model

Creates a new model within an existing domain. This will occur inside the SDK where all your types/interfaces exist.
