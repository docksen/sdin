import { pathExists } from 'fs-extra'
import { resolve, sep } from 'path'

/** 用户工作目录 */
export const CWD_PATH = process.cwd()

/** 本项目目录，即脚手架本身所在的目录 */
export const SELF_PATH = resolve(__dirname, '../../../')

/**
 * 查询路径下对应的文件是否存在，存在则返回路径，否则返回空字符串
 * resolveExtends('/path/to', 'index', ['.tsx', '.ts', '.jsx', '.js'])
 */
export async function resolveExtends(
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
