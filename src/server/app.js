'use strict'

const express = require('express')

const { optionalImport } = require('../utils')

function getMiddlewares (options) {
  return [].concat(
    ...['@composition/auth', '@composition/react'].map(ref => {
      const mod = optionalImport(ref)
      return [].concat(
        ...[].concat(mod || []).map(middleware => middleware(options))
      )
    })
  )
}

function app (options = {}) {
  options.core = options.core || {}

  const app = express()

  app.use(require('compression')())

  app.use(require('./assets')(options))

  if (options.core.isProd) {
    app.use(getMiddlewares(options))
  } else {
    app.use((req, res, next) => {
      // clear require cache
      Object.keys(require.cache)
        .filter(mod => !/[\\/]node_modules[\\/]/.test(mod))
        .forEach(mod => {
          delete require.cache[mod]
        })

      getMiddlewares(options)
        .reverse()
        .reduce(
          (next, middleware) => err => {
            const isErrorHandler = middleware.length === 4
            if (err) {
              if (isErrorHandler) {
                middleware(err, req, res, next)
              } else {
                next(err)
              }
            } else {
              if (isErrorHandler) {
                next()
              } else {
                middleware(req, res, next)
              }
            }
          },
          next
        )()
    })
  }

  app.use(require('./errors')(options))

  return app
}

module.exports = app
