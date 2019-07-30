'use strict'

const failHandler = ({ isProd }) =>
  isProd
    ? function failHandler (_, req, res, next) {
      res.sendStatus(500)
    }
    : function failHandler (err, req, res, next) {
      res.status(500).send(err.message || err.body || err)
    }

const logHandler = options =>
  function logHandler (err, req, res, next) {
    console.error(err)
    next(err)
  }

const redirectHandler = options =>
  function redirectHandler (err, req, res, next) {
    if (err && err.location && err.status >= 300 && err.status < 400) {
      res.redirect(err.status, err.location)
    } else {
      next(err)
    }
  }

module.exports = options => [
  redirectHandler(options),
  logHandler(options),
  failHandler(options)
]
