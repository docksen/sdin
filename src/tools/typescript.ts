import md5 from 'md5'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gulpRename from 'gulp-rename'
import { resolve } from 'path'
import { pathExists, remove, removeSync } from 'fs-extra'
import { createCacher } from 'utils/cache'
import { RuntimeError, getErrorMessage } from 'utils/errors'
import { withModulePath } from 'utils/path'
import { pipeline } from 'utils/stream'

export class TypescriptError extends RuntimeError {
  /** 编译要导出的 TS 文件时，文件不存在 */
  static readonly READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_IS_NOT_EXIST = 110101
  /** 编译要导出的 TS 文件时，编译失败 */
  static readonly READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_FAILED = 110102
}

const compiledFilePaths = createCacher<string, string>({
  onDelete: (_key, value) => {
    if (value) {
      remove(value)
    }
  },
  onDestory: list => {
    for (const item of list) {
      removeSync(item[1])
    }
  }
})

function getCacheKeyByFilePath(filePath: string) {
  const chars: string[] = []
  const hash = md5(filePath)
  for (var i = 0; i < hash.length; i += 4) {
    chars.push(hash[i])
  }
  return chars.join('')
}

/**
 * 编译 TS 文件，获得临时文件路径
 *
 * @param source 指定要读取的路径
 * @param strict 启用严格模式（严格模式：如果获取不到就报错退出）
 * @param expireTime 指定缓存过期时间（设为 0，则长期有效）
 */
export async function compileTypeScriptFile(
  source: string,
  strict?: boolean,
  expireTime?: number
): Promise<string | undefined> {
  if (!/\.tsx?$/.test(source)) {
    return source
  }
  if (compiledFilePaths.has(source)) {
    return compiledFilePaths.get(source)
  }
  if (!source || !(await pathExists(source))) {
    if (strict) {
      throw new TypescriptError(
        TypescriptError.READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_IS_NOT_EXIST,
        source ? `TypeScript file ${source} not exist.` : 'Cannot read empty path.'
      )
    } else {
      return undefined
    }
  }
  try {
    const target = resolve(source, '..')
    const fileName = '.' + getCacheKeyByFilePath(source) + '.tmp.js'
    await pipeline(
      gulp.src(source),
      gulpBabel({
        presets: [
          withModulePath('@babel/preset-env'),
          withModulePath('@babel/preset-react'),
          withModulePath('@babel/preset-typescript')
        ]
      }),
      gulpRename(fileName),
      gulp.dest(target)
    )
    const filePath = resolve(target, fileName)
    compiledFilePaths.set(source, filePath, expireTime)
    return filePath
  } catch (err) {
    if (strict) {
      throw new TypescriptError(
        TypescriptError.READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_FAILED,
        `Compile TypeScript file ${source} failed.\n${getErrorMessage(err)}`
      )
    } else {
      return undefined
    }
  }
}
