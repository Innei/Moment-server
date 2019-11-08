module.exports = options => {
  return async (req, res, next) => {
    if (req.session.master) {
      return next()
    }
    return res.status(401).send({ ok: 0, msg: '请先登录' })
  }
}
