import File from 'vinyl'
import gulpFilter from 'gulp-filter'
import { Transform } from 'stream'
import { replaceByString } from './string'

export type GulpExtraFilterPattern = string | string[] | gulpFilter.FileFunction

export interface GulpExtraFilterOptions extends gulpFilter.Options {
  /** 是否反转结果（不反转） */
  reverse?: boolean
}

export function gulpExtraFilter(
  pattern: gulpFilter.FileFunction,
  options?: GulpExtraFilterOptions
): gulpFilter.Filter
export function gulpExtraFilter(
  pattern?: string | string[],
  options?: GulpExtraFilterOptions
): gulpFilter.Filter | null
export function gulpExtraFilter(
  pattern?: GulpExtraFilterPattern,
  options?: GulpExtraFilterOptions
): gulpFilter.Filter | null {
  if (!pattern || (Array.isArray(pattern) && pattern.length === 0)) {
    return null
  }
  return gulpFilter(options?.reverse ? reverseGulpFilterPattern(pattern) : pattern, options)
}

function reverseGulpFilterPattern(pattern: GulpExtraFilterPattern): GulpExtraFilterPattern {
  if (typeof pattern === 'function') {
    return (file: File) => !pattern(file)
  }
  const patterns: string[] = ['*']
  if (typeof pattern === 'string') {
    patterns.push(pattern[0] === '!' ? pattern.slice(1) : '!' + pattern)
  } else if (Array.isArray(pattern)) {
    pattern.forEach(item => {
      patterns.push(item[0] === '!' ? item.slice(1) : '!' + item)
    })
  }
  return patterns
}

export function gulpReplaceVariables(
  variables: Record<string, string>,
  replacer: {
    (data: string, variables?: Record<string, any>): string
    (data: Buffer, variables?: Record<string, any>): Buffer
  } = replaceByString
) {
  return new Transform({
    objectMode: true,
    transform(file: File, _encoding, callback) {
      if (file.isNull()) {
        return callback(null, file)
      }
      if (file.isBuffer()) {
        file.contents = replacer(file.contents, variables)
      } else if (file.isStream()) {
        file.contents = file.contents.pipe(
          new Transform({
            transform(chunk: any, _encoding, callback) {
              if (Buffer.isBuffer(chunk)) {
                callback(null, replacer(chunk, variables))
              } else if (typeof chunk === 'string') {
                callback(null, replacer(chunk, variables))
              } else {
                callback(null, chunk)
              }
            }
          })
        )
      }
      callback(null, file)
    }
  })
}
