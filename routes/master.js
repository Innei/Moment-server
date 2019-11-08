const express = require('express')
const { compareSync } = require('bcrypt')
const assert = require('http-assert')
const Master = require('../models/master')

const router = express.Router()
router
  /**
   * 初次使用的初始化
   */
  .get('/init', async (req, res) => {
    if (req.app.get('isInit')) {
      return res.send({ ok: 0, msg: '已经完成初始化' })
    }
    return res.send({ ok: 1 })
  })

  .post(
    '/init',
    (req, res, next) => {
      if (req.app.get('isInit')) {
        return res.send({ ok: 0, msg: '已经完成初始化' })
      }
      next()
    },
    async (req, res) => {
      const {
        username,
        password,
        avatar = '',
        nickname = 'Moment',
        githubUrl,
        userIntro
      } = req.body
      assert(username, 422, '用户名不能为空')
      assert(password, 422, '密码不能为空')
      const zxc = require('zxcvbn')(password)
      if (zxc.score < 3) {
        return res.send({ ok: 0, msg: '密码设置过于简单' })
      }
      const doc = await Master.create({
        username,
        password,
        avatar,
        nickname,
        githubUrl,
        userIntro
      })
      req.app.set('isInit', true)
      res.send({ ok: 1, ...doc.toObject() })
    }
  )
  .post('/check_pass', async (req, res) => {
    const { password } = req.body
    assert(password, 422, '密码为空')
    const zxc = require('zxcvbn')(password)
    if (zxc.score < 3) {
      return res.send({ ok: 0, msg: '密码设置过于简单' })
    }
    res.send({ ok: 1 })
  })
  /**
   * 以下路由需要初始化后才能使用
   */
  .use(require('../middlewares/isInit')())
  /**
   * 获取主人信息
   */
  .get('/', async (req, res) => {
    const { username, avatar, githubUrl, nickname } = await Master.findOne()
    res.send({ ok: 1, username, avatar, githubUrl, nickname })
  })
  /**
   * 获取主人介绍
   */
  .get('/introduce', async (req, res) => {
    //console.log(req.session)

    const { userIntro } = await Master.findOne()
    res.send({ ok: 1, ...userIntro.toObject() })
  })
  /**
   * 主人登录接口
   */
  .post('/login', async (req, res) => {
    const { username, password } = req.body
    assert(username, 422, '君の名は')
    assert(password, 422, 'えぃ')
    const doc = await Master.findOne({ username }).select('+password')
    const verifyUsername = !!doc
    assert(verifyUsername, 400, '你不是我的主人')
    const verifyPass = compareSync(password, doc.password)
    assert(verifyPass, 400, '密码不对哦')
    const token = require('jsonwebtoken').sign(
      { _id: doc._id, password: doc.password },
      process.env.SECRET || 'tVnVq4zDhDtQPGPrx2qSOSdmuYI24C'
    )
    doc.token = token
    await doc.save()
    // req.session.master = username
    req.session.regenerate(err => {
      if (err) {
        return res.status(500).send({ ok: 0, msg: '出错啦' })
      }
      req.session.master = username
      res.send({ ok: 1, token })
    })
  })
  /**
   * 判断是否已经登录
   */
  .get('/check_logged', async (req, res) => {
    if (req.session.master) {
      return res.send({ ok: 1 })
    }
    res.send({ ok: 0 })
  })
  /**
   * 以下接口需要登录后才能使用
   */
  .use(require('../middlewares/isMaster')())
  /**
   * 修改密码
   */
  .post('/reset_password', async (req, res) => {
    const { password, oldPassword } = req.body
    assert(password, 422, '密码为空')
    assert(oldPassword, 422, '密码为空')

    const zxc = require('zxcvbn')(password)
    if (zxc.score < 3) {
      return res.status(400).send({ ok: 0, msg: '密码设置过于简单' })
    }

    const master = await Master.findOne()
    // 验证匹配
    const verifyPass = compareSync(oldPassword, master.password)
    assert(verifyPass, 400, '密码不对哦')
    // 因为只是单用户 (Single Mode)
    const doc = await Master.updateOne({}, { password })

    req.session.destroy(err => {
      if (err) {
        return res.json({ ok: 0, msg: '认证重置失败' })
      }
      res.clearCookie('master')
      res.send(doc)
    })
  })

  /**
   * 注销接口
   */
  .get('/sign_out', async (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.json({ ok: 0, msg: '退出登录失败' })
      }
      res.clearCookie('master')
      res.send({ ok: 1, msg: 'いってらっしゃい!' })
    })
  })
module.exports = router
