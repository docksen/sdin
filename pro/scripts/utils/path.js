const { sep, resolve } = require('path')
const { pathExistsSync } = require('fs-extra')
const { createLazyer } = require('./cache')

const rootPath = createLazyer(() => {
  let root = __dirname
  for (let i = 0; root && i < 10; i++) {
    if (pathExistsSync(resolve(root, 'package.json'))) {
      return root
    } else {
      root = resolve(root, '../')
    }
  }
  printError('Cannot find root path.', 99898796)
})

/**
 * 获取本项目的根目录
 */
function getRootPath() {
  return rootPath.get()
}

/**
 * 获取本项目的根目录下的路径
 */
function withRootPath(path) {
  return resolve(rootPath.get(), path)
}

function relativePosix(path1, path2) {
  let path1List = path1.split(sep)
  let path2List = path2.split(sep)
  const maxLen = Math.max(path1List.length, path2List.length)
  for (let i = 0; i < maxLen; i++) {
    if (path1List[i] !== path2List[i]) {
      path1List = path1List.slice(i)
      path2List = path2List.slice(i)
      break
    }
  }
  let relaPath = ''
  if (path1List.length > 1) {
    relaPath = new Array(path1List.length - 1).fill('../').join('')
  } else {
    relaPath = './'
  }
  return relaPath + path2List.join('/')
}

module.exports = {
  getRootPath,
  withRootPath,
  relativePosix
}
