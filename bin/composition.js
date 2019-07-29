#!/usr/bin/env node

'use strict'

const cluster = require('../src/server/cluster')

function dev () {
  serve()
}

function help () {
  version()
  console.log(`
npx composition [command] [options]

commands:
  dev
  help
  serve
  version
`)
}

function serve () {
  cluster()
}

function version () {
  console.log(`composition version: ${require('../package.json').version}`)
}

const commands = {
  dev,
  help,
  serve,
  version
}

if (module === require.main) {
  const cmd = process.argv[2]
  ;(commands[cmd] || serve)(...process.argv.slice(3))
}
