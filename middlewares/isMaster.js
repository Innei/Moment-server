module.exports = options => {
  return async (req, res, next) => {
    if (req.session.master) {
      return next()
    }

    if (req.headers.authorization) {
      try {
        const { code } = require('jsonwebtoken').verify(
          req.headers.authorization,
          process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
        )
        const accessCode = (await require('../models/master').findOne())
          .accessCode
        // console.log(code, '\n', accessCode)

        if (code === accessCode) {
          return next()
        }
      } catch (e) {
        console.log(e)
      }
    }
    return res.status(401).send({ ok: 0, msg: '请先登录' })
  }
}
