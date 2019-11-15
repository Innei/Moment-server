const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  formatTime: {
    type: String
  },
  ip: {
    type: String,
    // required: true,
    default: 'null'
  },
  path: {
    type: String
  },
  method: {
    type: String
  },
  fullDate: {
    year: {
      type: Number
    },
    month: {
      type: Number
    },
    day: {
      type: Number
    }
  },
  userAgent: {},
  referer: String
})
schema.index({ time: -1 })
schema.index({ 'fullDate.year': -1 })
module.exports = mongoose.model('Access', schema)
