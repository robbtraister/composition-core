'use strict'

const path = require('path')

const express = require('express')

function router (options = {}) {
  options.core = options.core || {}

  const router = express.Router()

  const routes = Object.hasOwnProperty.call(options.core, 'assets')
    ? options.core.assets
    : ['assets', 'dist', 'resources']

  ;[].concat(routes || []).forEach(route => {
    router
      .use(
        route.replace(/^\/*/, '/').replace(/\/*$/, '/*'),
        express.static(path.join(options.core.projectRoot, route)),
        { fallthrough: false }
      )
  })

  return router
}

module.exports = router
