const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  createdTime: Number,
  modifiedTime: { type: Number, index: -1 },
  type: { type: String, index: 1 },
  content: {
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    src: { type: String, trim: true },
    mood: { type: String, trim: true },
    weather: { type: String, trim: true },
    source: { type: String, trim: true }
  }
})

const types = ['moment', 'hitokoto', 'picture', 'idea']
const validateType = val => types.includes(val)

const validateContent = val => {}
schema
  .path('type')
  .validate(validateType, '验证 `{PATH}` 发现不合法数据 `{VALUE}`')

schema.path('createdTime').default(() => Date.now())
schema.path('modifiedTime').default(() => Date.now())

module.exports = mongoose.model('moment', schema)
