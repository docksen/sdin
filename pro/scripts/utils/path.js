const { resolve } = require('path')
const { pathExistsSync } = require('fs-extra')
const { createLazyer } = require('./cache')

const POS_OR_WIN_SEP_EXP = /[\/\\]+/
const WIN_DISK_FLAG_EXP = /^([a-zA-Z0-9]+)\:$/

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

/**
 * 转成 posix 路径碎片
 */
function getPosixPathSegments(path) {
  const pathSegments = path.trim().split(POS_OR_WIN_SEP_EXP)
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0] || ''
    if (firstSegment) {
      const matched = firstSegment.match(WIN_DISK_FLAG_EXP)
      if (matched && matched[1]) {
        pathSegments[0] = '/' + matched[1].toUpperCase()
      }
    } else {
      pathSegments.shift()
      pathSegments[0] = '/' + pathSegments[0]
    }
  }
  return pathSegments
}

/**
 * 转成 posix 路径
 */
function getPosixPath(path) {
  return getPosixPathSegments(path).join('/')
}

/**
 * 换成别名，换不成，就返回空
 */
function aliasPosix(path, alias) {
  const pathSegments = getPosixPathSegments(path)
  for (let i = 0, k = ''; i < pathSegments.length; i++) {
    k = k ? k + '/' + pathSegments[i] : pathSegments[i]
    const v = alias[k]
    if (v) {
      return getPosixPath([v, ...pathSegments.slice(i + 1)].join('/'))
    }
  }
}

function relativePosix(path1, path2) {
  let path1List = getPosixPathSegments(path1)
  let path2List = getPosixPathSegments(path2)
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
  aliasPosix,
  relativePosix
}
