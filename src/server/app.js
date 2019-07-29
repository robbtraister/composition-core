'use strict'

const express = require('express')

function optionalImport (ref) {
  try {
    return require(ref)
  } catch (_) {}
}

function app (options = {}) {
  const app = express()

  app.use(require('./assets')(options))

  if (!options.isProd) {
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
    if (options.isProd) {
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

  if (options.isProd) {
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
