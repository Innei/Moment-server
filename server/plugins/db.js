const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/moment', {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

