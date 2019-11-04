module.exports = app => {
  app.use('/api/moments', require('./moments'))
  app.use('/api/master', require('./master'))
  app.use('/api/upload', require('./upload'))
}
