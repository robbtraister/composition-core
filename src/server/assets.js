'use strict'

const path = require('path')

const express = require('express')
const favicon = require('serve-favicon')

function router (options = {}) {
  options.core = options.core || {}

  const router = express.Router()

  try {
    router.use(
      favicon(path.join(options.core.projectRoot, 'resources', 'favicon.ico'))
    )
  } catch (_) {
    router.all('/favicon.ico', (req, res, next) => {
      res.sendStatus(404)
    })
  }

  const routes = Object.hasOwnProperty.call(options.core, 'assets')
    ? options.core.assets
    : ['assets', 'dist', 'resources']

  ;[].concat(routes || []).forEach(route => {
    router
      .route(route.replace(/^\/*/, '/').replace(/\/*$/, '/*'))
      .get(express.static(options.core.projectRoot, { fallthrough: false }))
      .all((req, res, next) => {
        res.sendStatus(405)
      })
  })

  return router
}

module.exports = router
