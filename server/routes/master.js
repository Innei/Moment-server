const express = require('express')
const assert = require('http-assert')
const Master = require('../models/master')

const router = express.Router()
router
  .get('/', async (req, res) => {
    const { username, avatar, githubUrl, nickname } = await Master.findOne()
    res.send({ ok: 1, username, avatar, githubUrl, nickname })
  })

  .get('/introduce', async (req, res) => {
    const { userIntro } = await Master.findOne()
    res.send({ ok: 1, ...userIntro.toObject() })
  })

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
    res.send({ ok: 1, ...doc.toObject() })
  })

module.exports = router
