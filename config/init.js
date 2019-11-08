module.exports = async app => {
  if ((await require('../models/master').countDocuments()) > 0) {
    app.set('isInit', true)
  }
}
