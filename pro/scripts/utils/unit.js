const { Big } = require('big.js')

function ms2s(it) {
  return Big(it).div(1000).toNumber()
}

module.exports = { ms2s }
