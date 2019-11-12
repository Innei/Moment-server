require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const redis = require('redis')
const session = require('express-session')
const redisStore = require('connect-redis')(session)
const config = require('./config')

const port = process.env.PORT || 3000
const app = express()
const client = redis.createClient()
app.set('redis', client)
require('./plugins/db')(config)
// init
require('./config/init')(app)

// global middlewares
app.use(
  require('cors')({
    credentials: true,
    origin:
      process.env.NODE_ENV === 'development'
        ? `http://localhost:8080`
        : `${process.env.DOMAIN}`
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    name: 'moment.sid',
    secret:
      process.env.SECRET ||
      'gV2PNGn3DtehyY83Dg88136iyd5kHCwvsQo7shTVdrbeyiNurFE7lEgsMBDYCmtLM1QrQzabsdcZvbeLwQkii810w1TJkVwRRIZhYV5zQAlYiIkoXuZp2kJQ22hCSiLk', // 建议使用 128 个字符的随机字符串
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: process.env.MAXAGE
        ? Number(process.env.MAXAGE) * 60 * 1000 * 60 * 24
        : 60 * 1000 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development' ? false : true
    },
    store: new redisStore({ client })
  })
)

// require routes
require('./routes/index')(app)

app.listen(port)
console.log('Express app started on port ' + port)

app.use(async (err, req, res, next) => {
  if (err) {
    // 如果密码不对 等待3秒 防止爆破
    if (err.status === 400 || err.statusCode === 400) {
      await (milliseconds => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      })(3000)
    }
    return res
      .status(err.status || err.statusCode || 500)
      .send({ ok: 0, msg: err.message })
  }
  next()
})
