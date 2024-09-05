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
  const matrix = []
  for (let i = 0; i < list.length; i = i + 5) {
    matrix.push(list.slice(i, i + 5))
  }
  const cache = ['<table style="font-size:12px">', '  <tbody>']
  matrix.forEach(array => {
    cache.push('    <tr>')
    array.forEach(item => {
      cache.push(
        `      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/${item.code}.md">${item.enName} ${item.cnName} ${item.name}</a></td>`
      )
    })
    cache.push('    </tr>')
  })
  cache.push('  </tbody>')
  cache.push('</table>')
  return cache.join('\n')
}

module.exports = {
  getDocsTable
}
