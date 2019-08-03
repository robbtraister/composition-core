'use strict'

const { optionalImport } = require('./src/utils')

module.exports = [].concat(
  optionalImport('@composition/react/webpack.config.js')
)
