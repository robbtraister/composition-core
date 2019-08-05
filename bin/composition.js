#!/usr/bin/env node

'use strict'

const childProcess = require('child_process')
const path = require('path')

const {
  core: { projectRoot }
} = require('../env')

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

function version () {
  console.log(`composition version: ${require('../package.json').version}`)
}

function run (cmd) {
  childProcess.spawn('npm', ['run', cmd], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      PROJECT_ROOT: projectRoot
    },
    stdio: 'inherit'
  })
}

const dev = () => run('dev')

const commands = {
  dev,
  help,
  start: () => run('start'),
  version
}

if (module === require.main) {
  const cmd = process.argv[2]
  ;(commands[cmd] || dev)(...process.argv.slice(3))
}
