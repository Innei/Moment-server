'use strict'

/**
 * Expose
 */

const port = process.env.PORT || 3000

module.exports = {
  db: process.env.MONGODB_URL || 'mongodb://localhost/moment',
}
