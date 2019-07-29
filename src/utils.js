'use strict'

function optionalImport (ref) {
  try {
    return require(ref)
  } catch (_) {}
}

module.exports = {
  optionalImport
}
