import { posix, resolve, sep } from 'path'
import { pathExists, pathExistsSync } from 'fs-extra'
import { createLazyer } from './cache'
import { getPackageRootPath } from './npm'

const rootPath = createLazyer<string>(() => {
  return getPackageRootPath(__dirname)
})

/**
 * 获取本项目的根目录
 */
export function getRootPath() {
  return rootPath.get()
}

/**
 * 获取本项目的根目录下的路径
 */
export function withRootPath(path: string) {
  return resolve(rootPath.get(), path)
}

/**
 * 用户工作目录
 */
const workPath = createLazyer<string>(() => {
  return process.cwd()
})

/**
 * 获取当前命令行工作目录
 */
export function getWorkPath() {
  return workPath.get()
}

/**
 * 获取当前命令行工作目录下的路径
 */
export function withWorkPath(path: string) {
  return resolve(workPath.get(), path)
}

/**
 * 查询路径下对应的文件是否存在，存在则返回路径，否则返回空字符串
 * resolveExtends('/path/to', 'index', ['.tsx', '.ts', '.jsx', '.js'])
 */
export function resolveExtensionsSync(path: string, filename: string, exts: string[]): string {
  for (let i = 0; i < exts.length; i++) {
    const p = resolve(path, filename + exts[i])
    if (pathExistsSync(p)) {
      return p
    }
  }
  return ''
}

/**
 * 查询路径下对应的文件是否存在，存在则返回路径，否则返回空字符串
 * resolveExtends('/path/to', 'index', ['.tsx', '.ts', '.jsx', '.js'])
 */
export async function resolveExtensions(
  path: string,
  filename: string,
  exts: string[]
): Promise<string> {
  for (let i = 0; i < exts.length; i++) {
    const p = resolve(path, filename + exts[i])
    if (await pathExists(p)) {
      return p
    }
  }
  return ''
}

/**
 * 转成 posix 路径
 */
export function getPosixPath(path: string) {
  const pathSegment = path.split(sep).filter(Boolean)
  if (pathSegment.length > 0) {
    const firstSegment = pathSegment[0] || ''
    const matched = firstSegment.match(/^([a-zA-Z0-9]+)\:$/)
    if (matched && matched[1]) {
      pathSegment[0] = '/' + matched[1].toUpperCase()
    }
  }
  return pathSegment.join('/')
}

/**
 * 用 / 连接路径
 */
export function resolvePosix(...pathSegment: string[]) {
  return posix.resolve(...pathSegment.map(getPosixPath))
}

/**
 * 用 / 连接路径
 */
export function joinPosix(...pathSegment: string[]) {
  return posix.join(...pathSegment.map(getPosixPath))
}

/**
 * 计算 path2 中引入 path1 的相对路径，返回的路径以 '/' 为分隔符
 *
 * relativePosix('/a/b/c/d/e.js', '/a/b/f/g.js')
 * result === '../c/d/e.js'
 */
export function relativePosix(path1: string, path2: string): string {
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
