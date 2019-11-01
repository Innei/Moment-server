const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const schema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  password: {
    type: String,
    required: true,
    set(val) {
      return bcrypt.hashSync(val, 10)
    }
  },
  avatar: {
    type: String,
    set: urlParser
  },
  nickname: { type: String, trim: true },
  githubUrl: {
    type: String,
    set: urlParser
  },
  userIntro: {
    introduce: { type: String, trim: true },
    skill: {}
  },
  createdTime: {
    type: Number,
    default: Date.now()
  },
  token: String
})

function urlParser(val) {
  if (!/^http(s)?:\/\//.test(val)) {
    return `https://${val}`
  }
  return val
}

module.exports = mongoose.model('master', schema)
