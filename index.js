'use strict'

const app = require('./src/server/app')
const cluster = require('./src/server/cluster')
const server = require('./src/server')

module.exports = {
  app,
  cluster,
  server
}
