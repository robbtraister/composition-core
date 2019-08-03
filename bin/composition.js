#!/usr/bin/env node

'use strict'

const childProcess = require('child_process')

const cluster = require('../src/server/cluster')
const server = require('../src/server')

const {
  core: { projectRoot }
} = require('../env')

function findModule (ref) {
  try {
    return require
      .resolve(ref)
      .replace(
        new RegExp(`([\\/]node_modules[\\/]${ref.replace(/[\\/]+$/, '')}).+`),
        (_, $1) => $1
      )
  } catch (_) {}
}

function dev () {
  watch()
  server()
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

function start () {
  cluster()
}

function version () {
  console.log(`composition version: ${require('../package.json').version}`)
}

function watch () {
  childProcess.spawn('npm', ['run', 'watch'], {
    cwd: path.resolve(__dirname, '..'),
    env: {
      ...process.env,
      PROJECT_ROOT: projectRoot
    },
    stdio: 'inherit'
  })
}

const commands = {
  dev,
  help,
  start,
  version
}

if (module === require.main) {
  const cmd = process.argv[2]
  ;(commands[cmd] || start)(...process.argv.slice(3))
}
