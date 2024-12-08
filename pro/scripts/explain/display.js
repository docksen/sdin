const { resolve } = require('path')
const { readdir } = require('fs-extra')
const langs = require('./langs.json')

async function getDocsTable() {
  const files = await readdir(resolve(__dirname, '../../documents'))
  const langMap = {}
  langs.languages.forEach(i => (langMap[i.code] = i))
  const list = files
    .map(i => langMap[i.split('.')[0]])
    .filter(Boolean)
    .sort((a, b) => b.users - a.users)
  const cache = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    cache.push(
      `${i}. [${item.enName} **${item.cnName}** ${item.name}](https://github.com/docksen/sdin/blob/main/pro/documents/${item.code}.md)`
    )
  }
  return cache.join('\n')
}

module.exports = {
  getDocsTable
}
