'use strict'

const path = require('path')

const _merge = require('lodash.merge')

require('dotenv').config()

const isProd = /^prod/i.test(process.env.NODE_ENV)
const projectRoot = path.resolve('.')

function getConfigs () {
  try {
    return require(path.resolve(projectRoot, 'package.json')).composition
  } catch (_) {}
}

const configs = getConfigs() || {}

module.exports = _merge(
  configs,
  {
    isProd,
    port: configs.port || Number(process.env.PORT) || 8080,
    projectRoot,
    workerCount: configs.workerCount || Number(process.env.WORKER_COUNT) || require('os').cpus().length
  }
)
