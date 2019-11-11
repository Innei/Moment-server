const Moment = require('../models/moment')
const express = require('express')
const assert = require('assert')

const router = express.Router()

router
  .use(require('../middlewares/isInit')())
  .get('/', async (req, res) => {
    const { page = 1, size = 10 } = req.query
    assert(page > 0, '页数不能小于 0', 422)

    const data = await Moment.find({})
      .skip((page - 1) * size)
      .limit(Number(size))
      .sort({ createdTime: -1 })
    if (data.length === 0) {
      return res.send({ ok: 0, msg: '没有下页啦!' })
    }
    const total = await Moment.countDocuments()
    const totalPage = Math.ceil(total / size)
    const pageOptions = {
      size: data.length,
      currentPage: Number(page),
      totalPage,
      total,
      hasNextPage: totalPage > page,
      hasPrevPage: Number(page) !== 1
    }

    res.send({
      ok: 1,
      pageOptions,
      data
    })
  })
  .use(require('../middlewares/isMaster')())
  .post('/', async (req, res) => {
    let data
    const { type } = req.body
    assert(type, '不正确的类型', 422)
    const {
      title,
      body,
      mood,
      weather,
      source,
      src,
      comment
    } = req.body.content
    switch (type) {
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

    const documents = await Moment.create({ type, content: { ...data } })
    res.send({ ok: 1, documents })
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, '标识符为空', 422)
    const document = await Moment.deleteOne({ _id: id })
    res.send(document)
  })
module.exports = router
