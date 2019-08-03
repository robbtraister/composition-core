'use strict'

const { optionalImport } = require('./src/utils')

const configs = [].concat(
  optionalImport('@composition/react/webpack.config.js')
)

module.exports = (env, argv) =>
  configs.map(config =>
    (config instanceof Function)
      ? config(env, argv)
      : config
  )
