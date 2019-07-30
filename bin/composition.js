#!/usr/bin/env node

'use strict'

const childProcess = require('child_process')

const server = require('../src/server/cluster')

const {
  core: {
    projectRoot
  }
} = require('../env')

function findModule (ref) {
  try {
    return require.resolve(ref)
      .replace(
        new RegExp(`([\\/]node_modules[\\/]${ref.replace(/[\\/]+$/, '')}).+`),
        (_, $1) => $1
      )
  } catch (_) {}
}

function dev () {
  watch()
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
  server()
}

function version () {
  console.log(`composition version: ${require('../package.json').version}`)
}

function watch () {
  const location = findModule('@composition/react')
  if (location) {
    childProcess.spawn(
      'npm',
      ['run', 'watch'],
      {
        cwd: location,
        env: {
          PROJECT_ROOT: projectRoot
        },
        pipe: 'inherit'
      }
    )
  }
}

const commands = {
  dev,
  help,
  serve,
  start: serve,
  version
}

if (module === require.main) {
  const cmd = process.argv[2]
  ;(commands[cmd] || serve)(...process.argv.slice(3))
}
