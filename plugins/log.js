const chalk = require('chalk')
const moment = require('moment')
module.exports = (msg, type = 0) => {
  const dUNIX = new Date()
  const formatTime = moment(dUNIX).format('YYYY-MM-DD HH:mm:ss')

  const { notice, color } = getType(type)
  process.stdout.write(chalk[color](`[${notice.toUpperCase()}]`))
  process.stdout.write(`${chalk.yellow('[' + formatTime + ']')} ${msg}\n`)
}

function getType(type) {
  return {
    0: { notice: 'info', color: 'green' },
    1: { notice: 'warn', color: 'yellow' },
    2: { notice: 'high', color: 'red' },
    undefined: { notice: 'info', color: 'green' }
  }[type]
}
