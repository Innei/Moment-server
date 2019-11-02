const express = require('express')
const { compareSync } = require('bcrypt')
const assert = require('http-assert')
const Master = require('../models/master')

const router = express.Router()
router
  .post('/first_init', async (req, res) => {
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
      throw new Error('密码设置过于简单')
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
  })
  .use(require('../middlewares/isInit')())
  .get('/', async (req, res) => {
    const { username, avatar, githubUrl, nickname } = await Master.findOne()
    res.send({ ok: 1, username, avatar, githubUrl, nickname })
  })

  .get('/introduce', async (req, res) => {
    console.log(req.session)

    const { userIntro } = await Master.findOne()
    res.send({ ok: 1, ...userIntro.toObject() })
  })

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
    req.session.master = username
    res.send(req.session)
  })

module.exports = router
