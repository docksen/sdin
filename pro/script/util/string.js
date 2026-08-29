const crypto = require('crypto')
const chardet = require('chardet')
const { printError } = require('./print')

// const key = '1234567890123456'
// const iv = '1234567890123456'

function encrypt(data, password) {
  const iv = crypto.randomBytes(16)
  const key = crypto.createHash('shake256', { outputLength: 16 }).update(password).digest()
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  const data1 = cipher.update(data, 'utf8', 'hex')
  const data2 = cipher.final('hex')
  return iv.toString('hex') + data1 + data2
}

function decrypt(data, password) {
  try {
    const iv = Buffer.from(data.slice(0, 32), 'hex')
    const key = crypto.createHash('shake256', { outputLength: 16 }).update(password).digest()
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    const data1 = decipher.update(data.slice(32), 'hex', 'utf8')
    const data2 = decipher.final('utf8')
    return data1 + data2
  } catch (err) {
    printError('密码错误!', 94001023)
  }
}

function replaceByPhrases(data, phrases) {
  let content = ''
  const isBuffer = Buffer.isBuffer(data)
  if (isBuffer) {
    if (chardet.analyse(data).find(i => i.name === 'UTF-8')) {
      content = data.toString('utf8')
    }
  } else {
    content = data
  }
  if (!content || !phrases) {
    return data
  }
  const result = content.replace(/\$([0-9]+)/g, (origin, index) => {
    return phrases[index] || origin
  })
  return isBuffer ? Buffer.from(result) : result
}

module.exports = {
  replaceByPhrases,
  encrypt,
  decrypt
}
