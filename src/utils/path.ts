import { posix, resolve } from 'path'
import { pathExists, pathExistsSync } from 'fs-extra'
import { createLazyer } from './cache'
import { getPackageRootPath } from './npm'

const POS_OR_WIN_SEP_EXP = /[\/\\]+/
const WIN_DISK_FLAG_EXP = /^([a-zA-Z0-9]+)\:$/

const rootPath = createLazyer<string>(() => {
  return getPackageRootPath(__dirname)
})

/**
 * 获取本项目的根目录
 */
export function getRootPath(): string {
  return rootPath.get()
}

/**
 * 获取本项目的根目录下的路径
 */
export function withRootPath(path: string): string {
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
export function getWorkPath(): string {
  return workPath.get()
}

/**
 * 获取当前命令行工作目录下的路径
 */
export function withWorkPath(path: string): string {
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
 * 转成 posix 路径碎片
 */
export function getPosixPathSegments(path: string): string[] {
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
export function getPosixPath(path: string): string {
  return getPosixPathSegments(path).join('/')
}

/**
 * 用 / 连接路径
 */
export function resolvePosix(...pathSegments: string[]): string {
  return posix.resolve(...pathSegments.map(getPosixPath))
}

/**
 * 用 / 连接路径
 */
export function joinPosix(...pathSegments: string[]): string {
  return posix.join(...pathSegments.map(getPosixPath))
}

/**
 * 换成别名，换不成，就返回空
 */
export function aliasPosix(path: string, alias: Record<string, string>): string | undefined {
  const pathSegments = getPosixPathSegments(path)
  for (let i: number = 0, k: string = ''; i < pathSegments.length; i++) {
    k = k ? k + '/' + pathSegments[i] : pathSegments[i]
    const v = alias[k]
    if (v) {
      return getPosixPath([v, ...pathSegments.slice(i + 1)].join('/'))
    }
  }
}

/**
 * 计算 path2 相对于 path1 的路径，返回的路径以 '/' 为分隔符
 *
 * relativePosix('/src\\index.js', '/src/utils//array.js')
 * result === './utils/array.js'
 */
export function relativePosix(path1: string, path2: string): string {
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
