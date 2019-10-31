const mongoose = require('mongoose')

const schema = new mongoose.Schema('moment', {
  createdTime: Number,
  modifiedTime: Number,
  type: String,
  content: Object
})

const types = ['moment', 'hitokoto', 'picture', 'idea']
const validateType = val => types.includes(val)

const validateContent = val => {}
schema
  .path('type')
  .validate(validateType, '验证 `{PATH}` 发现不合法数据 `{VALUE}`')

schema.path('createdTime').default(() => Date.now())
schema.path('modifiedTime').default(() => Date.now())
