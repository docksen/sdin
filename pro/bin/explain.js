#!/usr/bin/env node

process.on('uncaughtException', error => console.error(error))
process.on('unhandledRejection', reason => console.error(reason))

const { explain, getDocsTable } = require('../scripts/explain')

main()

/**
 * 翻译本项目用户手册
 */
async function main() {
  await explain(['zh'])
  const desc = await getDocsTable()
  console.log(desc)
}
