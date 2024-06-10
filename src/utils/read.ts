import { pathExists, stat, readdir, readJson } from 'fs-extra'
import { resolve, join, basename } from 'path'
import md5 from 'md5'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gulpRename from 'gulp-rename'
import { pipeline } from './stream'
import { printError } from './print'
import { SELF_PATH } from './path'
import { createCacher } from './cache'
import type { Stats } from 'fs-extra'
import { ExitCode } from './constants'

export interface DeepReadNode {
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

export type DeepReadFilter = (node: DeepReadNode) => boolean | Promise<boolean>

export type DeepReadHandler = (node: DeepReadNode) => void | Promise<void>

async function __deepRead__({
  name,
  source,
  offset,
  current,
  handler,
  filter
}: {
  name: string
  source: string
  offset: string
  current: string
  handler: DeepReadHandler
  filter?: DeepReadFilter
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
  if (stats.isFile()) {
    await handler({ name, offset, source, current, stats })
  } else if (stats.isDirectory()) {
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

export interface DeepReadOptions {
  /** 需要扫描的代码路径 */
  source: string
  /** 处理文件 */
  handler: DeepReadHandler
  /** 过滤文件（为true才执行，否则跳过） */
  filter?: DeepReadFilter
}

/**
 * 深度遍历读取各个文件的信息
 *
 * - 不会读取文件夹的信息
 */
export async function deepRead({ source, handler, filter }: DeepReadOptions): Promise<void> {
  if (!(await pathExists(source))) {
    printError(`Read file ${source} is not exist.`, ExitCode.DEEP_READED_FILE_IS_NOT_EXIST)
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

const compiledFilePathCacher = createCacher()

async function compileTypescriptFile(
  source: string,
  strict?: boolean
): Promise<string | undefined> {
  if (!/\.tsx?$/.test(source)) {
    return source
  }
  if (compiledFilePathCacher.has(source)) {
    return compiledFilePathCacher.get(source)
  }
  if (!source || !(await pathExists(source))) {
    if (strict) {
      printError(
        source ? `File ${source} not exist.` : 'Cannot read empty path.',
        ExitCode.READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_IS_NOT_EXIST
      )
    } else {
      return undefined
    }
  }
  try {
    const target = resolve(SELF_PATH, '.swap/exports')
    const fileName = md5(source) + '.js'
    await pipeline(
      gulp.src(source),
      gulpBabel({
        presets: [
          resolve(SELF_PATH, 'node_modules/@babel/preset-env'),
          resolve(SELF_PATH, 'node_modules/@babel/preset-react'),
          resolve(SELF_PATH, 'node_modules/@babel/preset-typescript')
        ]
      }),
      gulpRename(fileName),
      gulp.dest(target)
    )
    const filePath = resolve(target, fileName)
    compiledFilePathCacher.set(source, filePath)
    return filePath
  } catch (err) {
    if (strict) {
      printError(`Compile file ${source} failed.`)
      printError(err, ExitCode.READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_FAILED)
    } else {
      return undefined
    }
  }
}

const exportsDataCacher = createCacher()

/**
 * 获取文件导出的信息（支持 ts、tsx、js、mjs、json 文件）
 *
 * @param source 指定要读取的路径
 * @param strict 启用严格模式（严格模式：如果获取不到就报错退出）
 */
export async function readExports(source: string, strict?: boolean): Promise<any> {
  if (exportsDataCacher.has(source)) {
    return exportsDataCacher.get(source)
  }
  let realSource = await compileTypescriptFile(source, strict)
  if (!realSource || !(await pathExists(realSource))) {
    if (strict) {
      printError(
        realSource ? `File ${realSource} not exist.` : 'Cannot read empty path.',
        ExitCode.READED_EXPORTS_FILE_IS_NOT_EXIST
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
    exportsDataCacher.set(source, data)
    return data
  } catch (err) {
    if (strict) {
      printError(`Read file ${source} failed.`)
      printError(err, ExitCode.READED_EXPORTS_FILE_FAILED)
    } else {
      return undefined
    }
  }
}
