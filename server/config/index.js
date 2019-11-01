'use strict'

/**
 * Module dependencies.
 */

const path = require('path')

const development = require('./env/development')
const production = require('./env/production')

/**
 * Expose
 */

module.exports = {
  development: Object.assign({}, development),
  production: Object.assign({}, production)
}[process.env.NODE_ENV || 'development']
