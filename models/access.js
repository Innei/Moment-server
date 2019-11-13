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
  }
})

module.exports = mongoose.model('Access', schema)
