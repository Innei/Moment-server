const express = require('express')
const multer = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, require('path').join(__dirname, '/../upload'))
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage })
router
  .get('/:file', async (req, res) => {
    const options = {
      root: require('path').join(__dirname, '/../upload/'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'content-type': 'image/png'
      }
    }

    const fileName = req.params.file
    res.sendFile(fileName, options, err => {
      if (err) {
        return res.send({ ok: 0, msg: '文件不存在' })
      }
    })
  })

  .use(require('../middlewares/isMaster')())
  .post('/', upload.single('pic'), async (req, res) => {
    req.file.src =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/api/upload/${req.file.filename}`
        : `${process.env.DOMAIN}/api/upload/${req.file.filename}`
    res.send(req.file)
  })

module.exports = router
