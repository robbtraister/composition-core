#!/usr/bin/env node

'use strict'

const env = require('../../env')

function server (options = env) {
  options.core = options.core || {}

  const app = require('./app')(options)

  const port = options.core.port || env.core.port
  app.listen(port, err => {
    err ? console.error(err) : console.log(`Listening on port: ${port}`)
  })
}

module.exports = server

if (module === require.main) {
  server()
}
