'use strict'

const path = require('path')

const _merge = require('lodash.merge')

require('dotenv').config()

const { optionalImport } = require('../src/utils')

const isProd = /^prod/i.test(process.env.NODE_ENV)
const projectRoot = process.env.PROJECT_ROOT || path.resolve('.')

function getConfigs () {
  try {
    return require(path.resolve(projectRoot, 'package.json')).composition || {}
  } catch (_) {}
  return {}
}

function optionalConfigs (ref) {
  return optionalImport(ref) || (() => ({}))
}

const configs = getConfigs()

module.exports = _merge(
  {
    ...optionalConfigs('@composition/auth/env')(configs),
    ...optionalConfigs('@composition/react/env')(configs)
  },
  configs,
  {
    core: {
      isProd,
      port: Number(process.env.PORT) || configs.port || 8080,
      projectRoot,
      workerCount:
        Number(process.env.WORKER_COUNT) ||
        configs.workerCount ||
        require('os').cpus().length
    }
  }
)
