import chardet from 'chardet'
import { createCacher } from './cache'
import { template, escapeRegExp } from 'lodash'

const NANOID_LETTER_SET = 'abcdefghijkmnprstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
const NANOID_CHARACTER_SET = NANOID_LETTER_SET + '1234567890'
const SEPARATOR_EXP = /[\s,\.;\\\|\/，、。；]+/g
const REPLACE_BY_LODASH_INTERPOLATE_EXP = /<%=([\s\S]+?)%>/g
const REPLACE_BY_CODE_SEARCH_VALUE_EXP = /\${([^\$\{\}]+)}/g

const regExps = createCacher<any, RegExp>()

/**
 * 生成对 URL 友好的 ID（仅包含数字和字母，以字母开头）
 *
 * @param length 生成 ID 的长度（默认：8）
 */
export function nanoid(length: number = 8): string {
  const ids: string[] = [NANOID_LETTER_SET[Math.floor(Math.random() * NANOID_LETTER_SET.length)]]
  for (let i = 1; i < length; i++) {
    ids.push(NANOID_CHARACTER_SET[Math.floor(Math.random() * NANOID_CHARACTER_SET.length)])
  }
  return ids.join('')
}

/**
 * 超出长度后，显示省略符
 */
export function ellipsis(data: string | undefined, length: number): string {
  if (!data) {
    return ''
  }
  const firstLine = data.includes('\n') ? data.split('\n')[0] : data
  if (firstLine.length < length) {
    return firstLine
  }
  return firstLine.slice(0, length - 3) + '...'
}

/**
 * 按照分隔符进行切割，并移除结果中的空白字符串
 */
export function splitBySeparator(data?: string): string[] {
  if (!data) {
    return []
  }
  return data.split(SEPARATOR_EXP).filter(Boolean)
}

/**
 * 运行代码（仅限简单的表达式）
 *
 * @param code 代码字符串
 * @param varibales 代码使用到的变量
 *
 * @example executeCode('a + b', { a: 1, b: 2 })
 */
export function executeCode(code?: string, varibales?: Record<string, any>): any {
  let segment = (code || '').trim()
  if (!segment) {
    return undefined
  }
  if (!segment.includes('\n') && !/^return /.test(segment)) {
    segment = `return (${segment})`
  }
  const keys = varibales ? Object.keys(varibales) : []
  const values = varibales ? keys.map(key => varibales[key]) : []
  const execute = new Function(...keys, segment)
  return execute(...values)
}

/**
 * 替换字符串（以 lodash 模版字符串的形式）
 *
 * @param data 示例：'aaaaa<%=expression%>bbbbb'
 */
export function replaceByLodash(data: string, variables?: Record<string, any>): string
export function replaceByLodash(data: Buffer, variables?: Record<string, any>): Buffer
export function replaceByLodash(
  data: string | Buffer,
  varibales?: Record<string, any>
): string | Buffer {
  let content: string = ''
  const isBuffer = Buffer.isBuffer(data)
  if (isBuffer) {
    if (chardet.analyse(data as any).find(i => i.name === 'UTF-8')) {
      content = data.toString('utf8')
    }
  } else {
    content = data
  }
  if (!content) {
    return data
  }
  const execute = template(content, { interpolate: REPLACE_BY_LODASH_INTERPOLATE_EXP })
  const result = execute(varibales)
  return isBuffer ? Buffer.from(result) : result
}

/**
 * 替换字符串（以 JavaScript 模版字符串的形式）
 *
 * @param data 示例：'aaaaa${expression}bbbbb'
 */
export function replaceByCode(data: string, variables?: Record<string, any>): string
export function replaceByCode(data: Buffer, variables?: Record<string, any>): Buffer
export function replaceByCode(
  data: string | Buffer,
  variables?: Record<string, any>
): string | Buffer {
  let content: string = ''
  const isBuffer = Buffer.isBuffer(data)
  if (isBuffer) {
    if (chardet.analyse(data as any).find(i => i.name === 'UTF-8')) {
      content = data.toString('utf8')
    }
  } else {
    content = data
  }
  if (!content || !content.includes('${')) {
    return data
  }
  const result = content.replace(REPLACE_BY_CODE_SEARCH_VALUE_EXP, (_i, code) => {
    return executeCode(code, variables)
  })
  return isBuffer ? Buffer.from(result) : result
}

/**
 * 替换字符串（以普通字符串的形式）
 *
 * @param data 示例：'aaaaaexpressionbbbbb'
 */
export function replaceByString(data: string, variables?: Record<string, any>): string
export function replaceByString(data: Buffer, variables?: Record<string, any>): Buffer
export function replaceByString(
  data: string | Buffer,
  variables?: Record<string, any>
): string | Buffer {
  let content: string = ''
  const isBuffer = Buffer.isBuffer(data)
  if (isBuffer) {
    if (chardet.analyse(data as any).find(i => i.name === 'UTF-8')) {
      content = data.toString('utf8')
    }
  } else {
    content = data
  }
  if (!content || !variables) {
    return data
  }
  let regExp: RegExp | undefined = regExps.get(variables)
  if (!regExp) {
    const escStrs = Object.keys(variables).map(i => escapeRegExp(i))
    regExp = new RegExp(escStrs.join('|'), 'g')
    regExps.set(variables, regExp)
  }
  const result = content.replace(regExp, code => variables[code] ?? code)
  return isBuffer ? Buffer.from(result) : result
}
