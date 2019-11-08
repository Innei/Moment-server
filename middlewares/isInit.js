module.exports = () => (req, res, next) => {
  //console.log(req.app.get('isInit'))
  
  if (req.app.get('isInit')) {
    return next()
  }
  return res.send({ ok: 0, msg: '请先初始化' })
}
