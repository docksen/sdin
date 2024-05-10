import File from 'vinyl'
import gulpFilter from 'gulp-filter'
import { Transform } from 'stream'
import { replaceByString } from './string'

export type GulpFilterPattern = string | string[] | gulpFilter.FileFunction

export function reverseGulpFilterPattern(pattern: GulpFilterPattern): GulpFilterPattern {
  if (typeof pattern === 'string') {
    return pattern[0] === '!' ? pattern.slice(1) : '!' + pattern
  }
  if (Array.isArray(pattern)) {
    return pattern.map(item => (item[0] === '!' ? item.slice(1) : '!' + item))
  }
  if (typeof pattern === 'function') {
    return (file: File) => !pattern(file)
  }
  return pattern
}

export function gulpReplace(
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
