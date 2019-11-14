const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  value: {}
})
schema.path('name').required(function () {
  return this.name
}, 'name 不能为空').unique(true)

module.exports = mongoose.model('Option', schema)
