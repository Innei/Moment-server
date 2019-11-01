require('dotenv').config()
const express = require('express')
const config = require('./config')

const port = process.env.PORT || 3000
const app = express()

require('./plugins/db')

// global middlewares
app.use(require('cors')())
app.use(express.json())

// require routes
require('./routes/index')(app)

app.listen(port)
console.log('Express app started on port ' + port)

app.use((err, req, res, next) => {
  if (err) {
    res
      .status(err.status || err.statusCode || 500)
      .send({ ok: 0, msg: err.message })
  }
  next()
})
