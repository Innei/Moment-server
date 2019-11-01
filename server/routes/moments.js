const Moment = require('../models/moment')
const express = require('express')
const assert = require('assert')

const router = express.Router()

router
  .get('/', async (req, res) => {
    const { page = 1, size = 10 } = req.query
    assert(page > 0, '页数不能小于0', 422)

    const data = await Moment.find({})
      .skip((page - 1) * size)
      .limit(Number(size))
    if (data.length === 0) {
      return res.send({ ok: 0, msg: '没有下页啦!' })
    }
    const totalPage = Math.ceil((await Moment.countDocuments()) / size)
    const pageOptions = {
      size: data.length,
      currentPage: Number(page),
      totalPage,
      hasNextPage: totalPage > page,
      hasPrevPage: Number(page) !== 1
    }

    res.send({
      ok: 1,
      pageOptions,
      data
    })
  })

  .post('/', async (req, res) => {
    let data
    const { title, body, mood, weather, source, src, comment } = req.body
    switch (req.body.type) {
      case 'moment':
        data = {
          title,
          body,
          mood,
          weather
        }
        break
      case 'hitokoto':
        data = {
          source,
          body
        }
        break
      case 'idea':
        data = {
          body
        }
        break
      case 'picture':
        data = { src, comment }
        break
      default:
        break
    }
    const documents = await Moment.create(data)
    res.send(documents)
  })

module.exports = router
