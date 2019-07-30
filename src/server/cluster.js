#!/usr/bin/env node

'use strict'

const cluster = require('cluster')

function main () {
  if (cluster.isMaster) {
    const {
      core: { workerCount }
    } = require('../../env')

    for (let w = 0; w < workerCount; w++) {
      cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
      // console.log(`worker ${worker.process.pid} died`)
      cluster.fork()
    })
  } else {
    require('.')()
  }
}

module.exports = main

if (module === require.main) {
  main()
}
