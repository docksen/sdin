import { pathExists, stat, readdir, readJson, readJsonSync, pathExistsSync } from 'fs-extra'
import { resolve, join, basename } from 'path'
import { createCacher } from './cache'
import { ReadingError, getErrorMessage } from './errors'
import { compileTypeScriptFile } from '../tools/typescript'
import type { Stats } from 'fs-extra'

export interface DeepReadingNode {
  /** 文件名 xxx.js */
  name: string
  /** 文件元信息 */
  stats: Stats
  /** 遍历的顶层路径 */
  source: string
  /** 文件相对于顶层的路径 */
  offset: string
  /** 文件的绝对路径 */
  current: string
}

export type DeepReadingFilter = (node: DeepReadingNode) => boolean | Promise<boolean>

export type DeepReadingHandler = (node: DeepReadingNode) => void | Promise<void>

async function __deepRead__({
  name,
  source,
  offset,
  current,
  includeDir,
  handler,
  filter
}: {
  name: string
  source: string
  offset: string
  current: string
  includeDir?: boolean
  handler: DeepReadingHandler
  filter?: DeepReadingFilter
}): Promise<void> {
  const stats = await stat(current)
  if (filter) {
    const isContinue = await filter({
      name,
      offset,
      source,
      current,
      stats
    })
    if (!isContinue) {
      return
    }
  }
  const isFile = stats.isFile()
  const isDirectory = stats.isDirectory()
  if (isFile || (includeDir && isDirectory)) {
    await handler({ name, offset, source, current, stats })
  }
  if (isDirectory) {
    const files = await readdir(current)
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      await __deepRead__({
        filter,
        handler,
        source,
        name: fileName,
        offset: join(offset, fileName),
        current: resolve(current, fileName)
      })
    }
  }
}

export interface DeepReadingOptions {
  /** 需要扫描的代码路径 */
  source: string
  /** 处理文件 */
  handler: DeepReadingHandler
  /** 过滤文件（为 true 才执行，否则跳过） */
  filter?: DeepReadingFilter
  /** 是否包括文件夹（为 true 则会将文件夹交给 handler） */
  includeDir?: boolean
}

/**
 * 深度遍历读取各个文件的信息
 *
 * - 不会读取文件夹的信息
 */
export async function deepRead({ source, handler, filter }: DeepReadingOptions): Promise<void> {
  if (!(await pathExists(source))) {
    throw new ReadingError(
      ReadingError.DEEP_READED_FILE_IS_NOT_EXIST,
      `Read file ${source} is not exist.`
    )
  }
  return __deepRead__({
    source,
    filter,
    handler,
    offset: '',
    current: source,
    name: basename(source)
  })
}

const exportsDatas = createCacher()

/**
 * 获取文件导出的信息（支持 ts、tsx、js、mjs、json 文件）
 *
 * @param source 指定要读取的路径
 * @param strict 启用严格模式（严格模式：如果获取不到就报错退出）
 * @param expireTime 指定缓存过期时间（设为 0，则长期有效）
 */
export async function readExports(
  source: string,
  strict?: boolean,
  expireTime?: number
): Promise<any> {
  if (exportsDatas.has(source)) {
    return exportsDatas.get(source)
  }
  let realSource = await compileTypeScriptFile(source, strict, expireTime)
  if (!realSource || !(await pathExists(realSource))) {
    if (strict) {
      throw new ReadingError(
        ReadingError.READED_EXPORTS_FILE_IS_NOT_EXIST,
        realSource ? `File ${realSource} not exist.` : 'Cannot read empty path.'
      )
    } else {
      return undefined
    }
  }
  try {
    let data: any = undefined
    if (/\.json$/.test(realSource)) {
      data = await readJson(realSource)
    } else if (/\.(js|mjs)$/.test(realSource)) {
      data = require(realSource)
    }
    exportsDatas.set(source, data)
    return data
  } catch (err) {
    if (strict) {
      throw new ReadingError(
        ReadingError.READED_EXPORTS_FILE_FAILED,
        `Read file ${source} failed.\n${getErrorMessage(err)}`
      )
    } else {
      return undefined
    }
  }
}

/**
 * 获取文件导出的信息（支持 js、mjs、json 文件）
 *
 * @param source 指定要读取的路径
 * @param strict 启用严格模式（严格模式：如果获取不到就报错退出）
 */
export function readExportsSync(source: string, strict?: boolean): any {
  if (exportsDatas.has(source)) {
    return exportsDatas.get(source)
  }
  if (!source || !pathExistsSync(source)) {
    if (strict) {
      throw new ReadingError(
        ReadingError.READED_EXPORTS_FILE_IS_NOT_EXIST,
        source ? `File ${source} not exist.` : 'Cannot read empty path.'
      )
    } else {
      return undefined
    }
  }
  try {
    let data: any = undefined
    if (/\.json$/.test(source)) {
      data = readJsonSync(source)
    } else if (/\.(js|mjs)$/.test(source)) {
      data = require(source)
    }
    exportsDatas.set(source, data)
    return data
  } catch (err) {
    if (strict) {
      throw new ReadingError(
        ReadingError.READED_EXPORTS_FILE_FAILED,
        `Read file ${source} failed.\n${getErrorMessage(err)}`
      )
    } else {
      return undefined
    }
  }
}
