import md5 from 'md5'
import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gulpRename from 'gulp-rename'
import { resolve } from 'path'
import { createCacher } from './cache'
import { SdinUtilsError, getErrorMessage } from './error'
import { pathExists, remove } from 'fs-extra'
import { withRootPath } from './path'
import { pipeline } from './stream'

const compiledFilePaths = createCacher({
  onDelete: (_key, value) => {
    if (value) {
      remove(value)
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

export async function compileTypeScriptFile(
  source: string,
  strict?: boolean
): Promise<string | undefined> {
  if (!/\.tsx?$/.test(source)) {
    return source
  }
  if (compiledFilePaths.has(source)) {
    return compiledFilePaths.get(source)
  }
  if (!source || !(await pathExists(source))) {
    if (strict) {
      throw new SdinUtilsError(
        SdinUtilsError.READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_IS_NOT_EXIST,
        source ? `TypeScript file ${source} not exist.` : 'Cannot read empty path.'
      )
    } else {
      return undefined
    }
  }
  try {
    const target = resolve(source, '..')
    const fileName = '.' + getCacheKeyByFilePath(source) + '.swp.js'
    await pipeline(
      gulp.src(source),
      gulpBabel({
        presets: [
          withRootPath('node_modules/@babel/preset-env'),
          withRootPath('node_modules/@babel/preset-react'),
          withRootPath('node_modules/@babel/preset-typescript')
        ]
      }),
      gulpRename(fileName),
      gulp.dest(target)
    )
    const filePath = resolve(target, fileName)
    compiledFilePaths.set(source, filePath)
    return filePath
  } catch (err) {
    if (strict) {
      throw new SdinUtilsError(
        SdinUtilsError.READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_FAILED,
        `Compile TypeScript file ${source} failed. ${getErrorMessage(err)}`
      )
    } else {
      return undefined
    }
  }
}
