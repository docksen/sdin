#!/usr/bin/env node

process.on('uncaughtException', error => console.error(error))
process.on('unhandledRejection', reason => console.error(reason))

const { writeJsonSync } = require('fs-extra')
const { mapValues } = require('lodash')
const { withRootPath } = require('../scripts/utils/path')

main()

/**
 * 锁定本项目依赖包版本
 */
function main() {
  const pkgPath = withRootPath('package.json')
  const pkgLockPath = withRootPath('package-lock.json')
  const pkg = require(pkgPath)
  const pkgLock = require(pkgLockPath)
  const depPkgs = pkgLock.packages
  const logs = []
  const iterator = (value, key) => {
    const depPkg = depPkgs[`node_modules/${key}`]
    if (depPkg && depPkg.version) {
      if (depPkg.version !== value) {
        logs.push(`- ${format(key, 36)} ${format(value, 16)} => ${format(depPkg.version, 16)}`)
      }
      return depPkg.version
    }
    return value
  }
  const newDeps = mapValues(pkg.dependencies, iterator)
  const newDevDeps = mapValues(pkg.devDependencies, iterator)
  pkg.dependencies = newDeps
  pkg.devDependencies = newDevDeps
  writeJsonSync(pkgPath, pkg, { spaces: 2 })
  if (logs.length > 0) {
    console.log('- Dependencies updated:')
    console.log(logs.join('\n'))
  } else {
    console.log('- No dependencies updated.')
  }
}

function format(str, width) {
  const diff = width - str.length
  if (diff > 0) {
    return str + Array(diff).fill(' ').join('')
  } else if (diff === 0) {
    return str
  } else {
    return str.slice(0, width - 3) + '...'
  }
}
