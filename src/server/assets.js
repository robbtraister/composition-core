'use strict'

const express = require('express')

function router (options = {}) {
  options.core = options.core || {}

  const router = express.Router()

  const routes = Object.hasOwnProperty.call(options.core, 'assets')
    ? options.core.assets
    : ['assets', 'dist', 'resources']

  ;[].concat(routes || []).forEach(route => {
    router
      .route(`/${route.replace(/^\/+/, '').replace(/\/+$/, '')}/*`)
      .get(express.static(options.core.projectRoot, { fallthrough: false }))
      .all((req, res, next) => {
        res.sendStatus(405)
      })
  })

  return router
}

module.exports = router
