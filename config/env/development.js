'use strict'

/**
 * Expose
 */

const port = process.env.PORT || 3000

module.exports = {
  port,
  db: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/moment',
}
