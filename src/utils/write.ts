import { readFile, outputFile } from 'fs-extra'
import { resolve } from 'path'
import { deepRead } from './read'
import type { DeepReadNode } from './read'

export type DeepCopyNode = DeepReadNode

export type DeepCopyHandler = (
  node: DeepCopyNode,
  content: Buffer
) => (string | Buffer) | Promise<string | Buffer>

export type DeepCopyFilter = (node: DeepCopyNode) => boolean | Promise<boolean>

export type DeepCopyRename = (node: DeepCopyNode, target: string) => string

export type DeepCopyRedirect = (node: DeepCopyNode, target: string) => string

export interface DeepCopyOptions {
  /** 需要扫描的代码路径 */
  source: string
  /** 目标文件路径 */
  target: string
  /** 转换文件内容的处理器 */
  handler?: DeepCopyHandler
  /** 过滤文件（为true才执行，否则跳过） */
  filter?: DeepCopyFilter
  /** 重定义目标文件名 */
  rename?: DeepCopyRename
  /** 重定向源文件路径 */
  redirect?: DeepCopyRedirect
}

/**
 * 深度遍历复制各个文件的信息
 *
 * - 文件名以_开头和结尾时，会自动修正（这是为了避开 git、npm 规则）
 */
export async function deepCopy({
  source,
  target,
  handler,
  filter,
  rename,
  redirect
}: DeepCopyOptions) {
  const SPEC_FILE_EXP = /^_(.*\.\w+)_$/
  const __handler__ = async (node: DeepCopyNode) => {
    let resPath = ''
    if (rename) {
      const newName = rename(node, target)
      if (newName) {
        resPath = node.offset ? resolve(target, node.offset) : target
        resPath = resolve(resPath, '..', newName)
      }
    }
    if (!resPath) {
      resPath = node.offset ? resolve(target, node.offset) : target
      if (node.name[0] === '_') {
        const matched = SPEC_FILE_EXP.exec(node.name)
        if (matched && matched[1]) {
          resPath = resolve(resPath, '../' + matched[1])
        }
      }
    }
    if (resPath) {
      let srcPath = (redirect && redirect(node, target)) || node.current
      let srcData = await readFile(srcPath)
      let resData: string | Buffer = srcData
      if (handler) {
        resData = await handler(node, srcData)
      }
      await outputFile(resPath, resData)
    }
  }
  await deepRead({
    source,
    handler: __handler__,
    filter
  })
}
