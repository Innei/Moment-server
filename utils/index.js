module.exports = {
  getRandomStr(num = 8) {
    return Math.random()
      .toString(36)
      .slice(-num)
  }
}
