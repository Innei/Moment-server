const express = require('express')
const router = express.Router()
const Access = require('../models/access')
const Option = require('../models/option')
const assert = require('http-assert')

if (process.env.NODE_ENV !== 'development') {
  router.use(require('../middlewares/recordAccess')())
}

router
  .get('/access', async (req, res) => {
    const { to, from, size = 20, page = 1 } = req.query

    assert(page > 0, 422, '页数不能小于 0')
    // 7 天访客数据
    // const toDate = to ? new Date(to) : new Date()
    // const fromDate = from
    //   ? new Date(from)
    //   : new Date(toDate.getTime() - 518400000)

    const data = await Access.find(
      to && from
        ? {
            time: {
              $gt: new Date(from).getTime(),
              $lte: new Date(to).getTime()
            }
          }
        : {}
    )
      .sort({ time: -1 })
      .skip((page - 1) * Number(size))
      .limit(Number(size))

    const total = await Access.countDocuments()
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

  .get('/analytics', async (req, res) => {
    const today = new Date()
    const todayData = await Access.find({
      'fullDate.year': today.getFullYear(),
      'fullDate.month': today.getMonth() + 1,
      'fullDate.day': today.getDate()
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
      .map(() => ({ day: null, PV: 0, IP: 0, UV: 0 }))
    // console.log(weekData.shift().time)
    const temp = [...weekData]

    for (
      let time =
          new Date(
            `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate() +
              1}`
          ).getTime() - 1,
        i = 6,
        length = weekData.length;
      time >= today.getTime() - 518400000 && i < length;
      time -= 86400000, i--
    ) {
      let u = temp.shift()
      // ip
      const ip = await Access.distinct('ip', {
        time: {
          $gt: time - 86400000,
          $lte: time
        }
      })
      weekNum[i].IP = ip.length
      // TODO UV

      const day = new Date(time)
      weekNum[i].day = `${day.getMonth() + 1}-${day.getDate()}`
      while (u && u.time <= time && u.time > time - 86400000) {
        weekNum[i].PV++
        u = temp.shift()
      }
    }

    const fromInit = Math.floor(
      (today - (await Option.findOne({ name: 'init_day' })).value) / 86400000
    )

    // 分析 日 数据
    const hours = today.getHours()
    const zero = new Date(
      `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
    ).getTime()
    const dayNum = []

    for (
      let time = zero + 3600000, hour = 0;
      time <= zero + 86400000;
      time += 3600000, hour++
    ) {
      let PV = 0,
        IP = 0
      const ipSet = new Set()
      for (const i of todayData) {
        if (i.time < time && i.time >= time - 3600000) {
          PV++
          if (!ipSet.has(i.ip)) {
            IP++
          }
          ipSet.add(i.ip)
          // console.log(ipSet)
        }
      }
      dayNum.push({
        hour,
        PV,
        IP
      })
    }
    res.send({
      ok: 1,
      today: todayData.length,
      total,
      week: weekData.length,
      year,
      weekNum,
      dayNum,
      from_create_day: fromInit
    })
  })

module.exports = router

/**
 * 一天 86400000  24 * 60 * 60 * 1000
   三天 259200000
   七天 518400000

 */
