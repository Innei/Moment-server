module.exports = app => {
  const router = require('express').Router()

  router.use('/moments', require('./moments'))
  router.use('/master', require('./master'))
  router.use('/upload', require('./upload'))
  router.use('/options', require('./options'))
  if (process.env.NODE_ENV === 'production') {
    app.use('/', router)
  } else {
    app.use('/api', router)
  }

  // app.use('/api/moments', require('./moments'))
  // app.use('/api/master', require('./master'))
  // app.use('/api/upload', require('./upload'))
  // app.use('/api/options', require('./options'))
}
