const express = require('express')
const router = express.Router()
const Access = require('../models/access')

if (process.env.NODE_ENV !== 'development') {
  router.use(require('../middlewares/recordAccess')())
}

router
  .get('/access', async (req, res) => {
    const { to, from } = req.query

    const toDate = to ? new Date(to) : new Date()

    const fromDate = from
      ? new Date(from)
      : new Date(toDate.getTime() - 518400000)
    // const day = toDate.getDate()
    // const month = toDate.getMonth() + 1
    // const year = toDate.getYear() + 1900

    // const doc = await Access.find({
    //   'fullDate.year': year,
    //   'fullDate.month': month,
    //   'fullDate.day': {
    //     $lte: day,
    //     $gt: day - 7 <= 0 ? 0 : day - 7
    //   }
    // }).sort({ time: -1 })

    const doc = await Access.find({
      time: {
        $gt: fromDate.getTime(),
        $lte: toDate.getTime()
      }
    }).sort({ time: -1 })
    res.send(doc)
  })

  .get('/analytics', async (req, res) => {
    const today = new Date()
    // const day = today.getDate()
    // const month = today.getMonth() + 1
    // const year = today.getYear() + 1900

    // const num = await Access.countDocuments({
    //   time: {
    //     $gt: today.getTime() - 86400000,
    //     $lte: today.getTime()
    //   }
    // })
    const num = await Access.countDocuments({
      'fullDate.year': today.getYear() + 1900,
      'fullDate.month': today.getMonth() + 1,
      'fullDate.day': {
        $lte: today.getDate(),
        $gt: today.getDate() - 7 <= 0 ? 0 : today.getDate() - 7
      }
    }).sort({ time: -1 })

    const total = await Access.countDocuments()
    const weekData = await Access.find({
      time: {
        $gt: today.getTime() - 518400000,
        $lte: today.getTime()
      }
    })
    const year = await Access.countDocuments({
      time: {
        $gt: today.getTime() - 31536000000,
        $lte: today.getTime()
      }
    })

    // 分析周数据
    const weekNum = Array(7)
      .fill()
      .map(u => ({ day: null, PV: 0 }))
    // console.log(weekData.shift().time)
    const temp = [...weekData]

    for (
      let time = today.getTime() + 2, i = 6, length = weekData.length;
      time >= today.getTime() - 518400000 && i < length;
      time -= 86400000, i--
    ) {
      let u = temp.shift()
      const day = new Date(time)
      weekNum[i].day = `${day.getMonth() + 1}-${day.getDate()}`
      while (u && u.time <= time) {
        weekNum[i].PV++
        u = temp.shift()
      }
    }

    res.send({ ok: 1, today: num, total, week: weekData.length, year, weekNum })
  })

module.exports = router

/**
 * 一天 86400000  24 * 60 * 60 * 1000
   三天 259200000
   七天 518400000

 */
