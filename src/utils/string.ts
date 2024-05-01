import chardet from 'chardet'
import { template } from 'lodash'

const NANOID_LETTER_SET = 'abcdefghijkmnprstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
const NANOID_CHARACTER_SET = `${NANOID_LETTER_SET}1234567890`

/**
 * 生成对 URL 友好的 ID（仅包含数字和字母，以字母开头）
 *
 * @param length 生成 ID 的长度（默认：8）
 */
export function nanoid(length: number = 8): string {
  let id = NANOID_LETTER_SET[Math.floor(Math.random() * NANOID_LETTER_SET.length)]
  while (id.length < length) {
    id += NANOID_CHARACTER_SET[Math.floor(Math.random() * NANOID_CHARACTER_SET.length)]
  }
  return id
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
  const run = new Function(...keys, segment)
  return run(...values)
}

/**
 * 替换字符串（以 lodash 模版字符串的形式）
 *
 * @param data 示例：'aaaaa<%=expression%>bbbbb'
 */
export function replaceByLodash(data: Buffer | string, varibales?: Record<string, any>) {
  let content = ''
  if (typeof data === 'string') {
    content = data
  } else {
    const encodeInfo = chardet.analyse(data)
    if (encodeInfo.find(i => i.name === 'UTF-8')) {
      content = data.toString('utf8')
    }
  }
  if (!content) {
    return data
  }
  const compiled = template(content, { interpolate: /<%=([\s\S]+?)%>/g })
  return compiled(varibales)
}

/**
 * 替换字符串（以 JavaScript 模版字符串的形式）
 *
 * @param data 示例：'aaaaa${expression}bbbbb'
 */
export function replaceByCode(data: Buffer | string, variables?: Record<string, any>) {
  let content: string = ''
  if (typeof data === 'string') {
    content = data
  } else {
    const encodeInfo = chardet.analyse(data)
    if (encodeInfo.find(i => i.name === 'UTF-8')) {
      content = data.toString('utf8')
    }
  }
  if (!content || !content.includes('${')) {
    return data
  }
  return content.replace(/\${([^\$\{\}]+)}/g, (_i, code) => {
    return executeCode(code, variables)
  })
}
