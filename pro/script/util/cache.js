/**
 * 创建一个惰性值存储器
 */
function createLazyer(init) {
  const lazyer = {
    initialized: false,
    get: () => {
      if (!lazyer.initialized) {
        const value = init()
        lazyer.get = () => value
        lazyer.initialized = true
        return value
      } else {
        return 0
      }
    }
  }
  return lazyer
}

module.exports = { createLazyer }
