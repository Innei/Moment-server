'use strict'

/**
 * Module dependencies.
 */

// const path = require('path')

const development = require('./env/development')
const production = require('./env/production')

/**
 * Expose
 */

module.exports = {
  development: Object.assign({}, process.env, development),
  production: Object.assign({}, process.env, production)
}[process.env.NODE_ENV || 'development']
