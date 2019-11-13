module.exports = config => {
  const mongoose = require('mongoose')

  mongoose.connect(config.db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}
