'use strict'

const express = require('express')

const { optionalImport } = require('../utils')

function app (options = {}) {
  options.core = options.core || {}

  const app = express()

  app.use(require('./assets')(options))

  if (!options.core.isProd) {
    // clear require cache
    app.use((req, res, next) => {
      Object.keys(require.cache)
        .filter(mod => !/[\\/]node_modules[\\/]/.test(mod))
        .forEach(mod => {
          delete require.cache[mod]
        })
      next()
    })
  }

  function optionalUse (ref) {
    if (options.core.isProd) {
      const mod = optionalImport(ref)
      mod && app.use(mod(options))
    } else {
      app.use((req, res, next) => {
        const mod = optionalImport(ref)
        mod ? mod(options)(req, res, next) : next()
      })
    }
  }

  optionalUse('@composition/auth')
  optionalUse('@composition/react')

  if (options.core.isProd) {
    app.use(require('./errors')(options))
  } else {
    app.use((err, req, res, next) => {
      ;[]
        .concat(require('./errors')(options) || [])
        .reverse()
        .reduce(
          (next, middleware) => () => {
            middleware(err, req, res, next)
          },
          next
        )()
    })
  }

  return app
}

module.exports = app
