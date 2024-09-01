const md5 = require('md5')
const { URL } = require('url')
const { prompt } = require('enquirer')
const { resolve } = require('path')
const { readFile, writeFile } = require('fs-extra')
const langs = require('./langs.json')
const { printSuccess } = require('../utils/print')
const { decrypt, replaceByPhrases } = require('../utils/string')

const EXPLAIN_SETTINGS = [
  '2f4d090c60678556942a04529a7ca894110c8de7db7a7b430e6a95f7f210298e',
  '897f9ef75b6ab8c22805a544bac50e7f7c462515e6b8579783397c3269efeff5',
  'a6b015dcc11b2112c9839890c015325f0ad3c1effceb981de6f241f1deaaa18e',
  '3b66f50df65b82f234a5132c18743f633ea830b3afaf88e36ef57b634a8db485'
]

async function explain(languages) {
  const password = await enquirePassword()
  const settings = JSON.parse(decrypt(EXPLAIN_SETTINGS.join(''), password))
  const manual = await readFile(resolve(__dirname, '_manual.txt'), 'utf8')
  const phrases1 = await readFile(resolve(__dirname, '_phrases.txt'), 'utf8')
  for (const language of languages) {
    let phrases2 = undefined
    if (language === 'zh') {
      phrases2 = phrases1.split('\n')
    } else {
      phrases2 = await translatePhrases(phrases1, language, settings)
    }
    const content = replaceByPhrases(manual, [''].concat(phrases2))
    const target = resolve(__dirname, `../../documents/${language}.md`)
    await writeFile(target, content)
    await new Promise(res => setTimeout(res, 100))
    printSuccess(`Successfully translated ${language} language.`)
  }
}

async function enquirePassword() {
  const { password } = await prompt([
    {
      type: 'input',
      name: 'password',
      message: "What's password of translation platform settings?",
      required: true
    }
  ])
  return password
}

async function translatePhrases(phrases, language, settings) {
  const appId = settings[0]
  const signKey = settings[1]
  const appHref = settings[2]
  const url = new URL(appHref)
  const query = url.searchParams
  const salt = Math.round(Math.random() * 100000000)
  const lang = langs.languages.find(i => i.code === language)
  if (!lang) {
    throw new Error('No language code configured.')
  }
  query.set('q', phrases)
  query.set('from', 'zh')
  query.set('to', lang.code)
  query.set('appid', appId)
  query.set('salt', salt)
  query.set('sign', md5(appId + phrases + salt + signKey))
  const response = await fetch(url, { method: 'GET' })
  const data = await response.json()
  const result = data?.trans_result || []
  if (data.error_code || result.length <= 0) {
    throw new Error(`Failed to translated ${language} language.`)
  }
  const source = phrases.split('\n')
  const target = []
  const transMap = {}
  result.forEach(item => (transMap[item.src] = item.dst))
  source.forEach((item, index) => (target[index] = transMap[item]))
  return target
}

module.exports = {
  explain
}
