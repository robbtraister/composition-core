'use strict'

const express = require('express')

function router (options = {}) {
  const router = express.Router()

  const routes = Object.hasOwnProperty.call(options, 'assets')
    ? options.assets
    : ['assets', 'dist', 'resources']

  ;[].concat(routes || []).forEach(route => {
    router
      .route(`/${route.replace(/^\/+/, '').replace(/\/+$/, '')}/*`)
      .get(express.static(options.projectRoot, { fallthrough: false }))
      .all((req, res, next) => {
        res.sendStatus(405)
      })
  })

  return router
}

module.exports = router
