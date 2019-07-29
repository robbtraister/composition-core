'use strict'

const path = require('path')

const _merge = require('lodash.merge')

require('dotenv').config()

const { optionalImport } = require('../src/utils')

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
    auth: optionalImport('@composition/auth/env'),
    react: optionalImport('@composition/react/env'),
    isProd,
    port: configs.port || Number(process.env.PORT) || 8080,
    projectRoot,
    workerCount: configs.workerCount || Number(process.env.WORKER_COUNT) || require('os').cpus().length
  }
)
