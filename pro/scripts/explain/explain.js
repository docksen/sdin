const md5 = require('md5')
const { URL } = require('url')
const { prompt } = require('enquirer')
const { resolve } = require('path')
const { readFile, writeFile } = require('fs-extra')
const langs = require('./langs.json')
const { printSuccess, green, blue, yellow, printError } = require('../utils/print')
const { decrypt, replaceByPhrases } = require('../utils/string')

const EXPLAIN_SETTINGS = [
  '2f4d090c60678556942a04529a7ca894110c8de7db7a7b430e6a95f7f210298e',
  '897f9ef75b6ab8c22805a544bac50e7f7c462515e6b8579783397c3269efeff5',
  'a6b015dcc11b2112c9839890c015325f0ad3c1effceb981de6f241f1deaaa18e',
  '3b66f50df65b82f234a5132c18743f633ea830b3afaf88e36ef57b634a8db485'
]

async function explain(languageCodes) {
  const password = await enquirePassword()
  const settings = JSON.parse(decrypt(EXPLAIN_SETTINGS.join(''), password))
  const manual = await readFile(resolve(__dirname, '_manual.txt'), 'utf8')
  const phrasesEn = await readFile(resolve(__dirname, '_phrases.en.txt'), 'utf8')
  const phrasesZh = await readFile(resolve(__dirname, '_phrases.zh.txt'), 'utf8')
  if (getStringByteSize(phrasesEn) > 5000) {
    throw new Error('Phrases content too large.')
  }
  const languageMap = {}
  langs.languages.forEach(i => (languageMap[i.code] = i))
  const failedList = []
  for (const languageCode of languageCodes) {
    await new Promise(res => setTimeout(res, 100))
    const language = languageMap[languageCode]
    if (!language) {
      throw new Error('No language code configured.')
    }
    try {
      let phrases2 = undefined
      if (language.code === 'zh') {
        phrases2 = phrasesZh.split('\n')
      } else if (language.code === 'en') {
        phrases2 = phrasesEn.split('\n')
      } else {
        phrases2 = await translatePhrases(phrasesEn, language, settings)
      }
      const content = replaceByPhrases(manual, [''].concat(phrases2))
      const target = resolve(__dirname, `../../documents/${language.code}.md`)
      await writeFile(target, content)
      printSuccess(
        `Successfully translated ${yellow(language.code)} ${green(language.cnName)} ${blue(
          language.enName
        )}.`
      )
    } catch (err) {
      printError(err.message)
      failedList.push(language)
    }
  }
  if (failedList.length > 0) {
    console.log(JSON.stringify(failedList.map(i => i.code)))
  }
}

function getStringByteSize(str) {
  const blob = new Blob([str])
  return blob.size
}

async function enquirePassword() {
  const { password } = await prompt([
    {
      type: 'password',
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
  query.set('q', phrases)
  query.set('from', 'en')
  query.set('to', language.code)
  query.set('appid', appId)
  query.set('salt', salt)
  query.set('sign', md5(appId + phrases + salt + signKey))
  const response = await fetch(url, { method: 'GET' })
  const data = await response.json()
  const result = data?.trans_result || []
  if (data.error_code || result.length <= 0) {
    throw new Error(
      `Failed to translated ${yellow(language.code)} ${green(language.cnName)} ${blue(
        language.enName
      )}. ${JSON.stringify(data)}`
    )
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
