import { posix, resolve } from 'path'
import { pathExists, pathExistsSync, stat } from 'fs-extra'
import { createLazyer } from './cache'
import { getDependenceName, getPackageRootPath } from './npm'
import { PathError } from './errors'
import { trim } from 'lodash'

const POS_OR_WIN_SEP_EXP = /[\/\\]+/
const WIN_DISK_FLAG_EXP = /^([a-zA-Z0-9]+)\:$/

export const TJSX_FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

export const TJSXS_FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.json']

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
  const prefix = rootPath.get()
  return path.startsWith(prefix) ? path : resolve(prefix, path)
}

/**
 * 获取本项目关联的 node_module 目录下的路径
 */
export function withModulePath(importedPath: string): string {
  const moduleName = getDependenceName(importedPath)
  const rootSegments = getPosixPathSegments(rootPath.get())
  let current: string = rootPath.get()
  for (let i = 0; i < rootSegments.length; i++) {
    if (pathExistsSync(resolve(current, 'node_modules', moduleName))) {
      return resolve(current, 'node_modules', importedPath)
    } else {
      current = resolve(current, '../')
    }
  }
  throw new PathError(PathError.NOT_HAS_MODULE_PATH, `Cannot find module ${moduleName}.`)
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
  const prefix = workPath.get()
  return path.startsWith(prefix) ? path : resolve(prefix, path)
}

export async function isNonEmptyDir(path: string): Promise<boolean> {
  try {
    const srcStat = await stat(path)
    return srcStat.isDirectory() && srcStat.size > 0
  } catch (_err: any) {
    return false
  }
}

export async function dirExistOrThrow(path: string): Promise<void> {
  try {
    const srcStat = await stat(path)
    if (!srcStat.isDirectory()) {
      throw new PathError(PathError.DIR_IS_NOT_EXIST, `Folder ${path} is not directory.`)
    }
  } catch (_err: any) {
    throw new PathError(PathError.DIR_IS_NOT_EXIST, `Folder ${path} is not exist.`)
  }
}

export async function fileExistOrThrow(path: string): Promise<void> {
  try {
    const srcStat = await stat(path)
    if (!srcStat.isFile()) {
      throw new PathError(PathError.FILE_IS_NOT_EXIST, `File ${path} is not file.`)
    }
  } catch (_err: any) {
    throw new PathError(PathError.FILE_IS_NOT_EXIST, `File ${path} is not exist.`)
  }
}

/**
 * 查询路径下对应的文件是否存在，存在则返回路径，否则返回空字符串
 * resolveExtends('/path/to', 'index', ['.tsx', '.ts', '.jsx', '.js'])
 */
export function resolveExtensionSync(path: string, filename: string, extensions: string[]): string {
  for (let i = 0; i < extensions.length; i++) {
    const p = resolve(path, filename + extensions[i])
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
export async function resolveExtension(
  path: string,
  filename: string,
  extensions: string[]
): Promise<string> {
  for (let i = 0; i < extensions.length; i++) {
    const p = resolve(path, filename + extensions[i])
    if (await pathExists(p)) {
      return p
    }
  }
  return ''
}

/**
 * 移除路径前后的空格和斜杠，并根据需要，添加斜杠
 */
export function resolvePosixSlash(path: string, startSlash?: boolean, endSlash?: boolean) {
  let target = trim(path, '/ ')
  if (target) {
    if (startSlash) {
      target = '/' + target
    }
    if (endSlash) {
      target = target + '/'
    }
  } else {
    if (startSlash || endSlash) {
      target = '/'
    }
  }
  return target
}

/**
 * 转成 posix 路径碎片
 */
export function getPosixPathSegments(path: string): string[] {
  const pathSegments = path.trim().split(POS_OR_WIN_SEP_EXP)
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
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
