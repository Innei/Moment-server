const Moment = require('../models/moment')
const express = require('express')
const assert = require('http-assert')

const router = express.Router()

router
  .use(require('../middlewares/isInit')())
  .get('/', require('../middlewares/recordAccess')(), async (req, res) => {
    const { page = 1, size = 10 } = req.query
    assert(page > 0, 422, '页数不能小于 0')

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

  .get('/:id', require('../middlewares/recordAccess')(), async (req, res) => {
    assert(req.params.id, 422, '标识符为空')

    const doc = await Moment.findById(req.params.id)

    doc
      ? res.send({ ok: 1, ...doc.toObject() })
      : res.send({ ok: 0, msg: '记录不存在' })
  })
  .use(require('../middlewares/isMaster')())
  .post('/', async (req, res) => {
    
    const { type, content } = req.body
    assert(type, 422, '不正确的类型')
    assert(content, 422, '不正确的内容')
    
    const documents = await Moment.create({
      type,
      content: { ...pickContent(content, type) }
    })
    res.send({ ok: 1, documents })
  })

  .put('/:id', async (req, res) => {
    const id = req.params.id
    assert(id, 422, '标识符为空')
    const { type, content } = req.body
    assert(type, 422, '不正确的类型')
    assert(content, 422, '不正确的内容')
    const query = await Moment.updateOne(
      { _id: id, type },
      {
        content: { ...pickContent(content, type) },
        modifiedTime: Date.now()
      }
    )

    res.send({ ok: 1, query })
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params
    assert(id, 422, '标识符为空')
    const document = await Moment.deleteOne({ _id: id })
    res.send(document)
  })

module.exports = router

function pickContent(content, type) {
  let data
  const { title, body, mood, weather, source, src, comment } = content
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
      assert(false, 422, '不正确的类型')
      break
  }
  return data
}
