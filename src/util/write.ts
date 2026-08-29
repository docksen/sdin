import { readFile, outputFile, pathExists } from 'fs-extra'
import { resolve } from 'path'
import { deepRead } from './read'
import { WritingError } from './errors'
import { green, magenta, printTask, red } from './print'
import type { DeepReadingNode } from './read'

export type DeepCopyingNode = DeepReadingNode

export type DeepCopyingHandler = (
  node: DeepCopyingNode,
  content: Buffer
) => (string | Buffer) | Promise<string | Buffer>

export type DeepCopyingFilter = (node: DeepCopyingNode) => boolean | Promise<boolean>

export type DeepCopyingRename = (node: DeepCopyingNode, target: string) => string

export type DeepCopyingRedirect = (node: DeepCopyingNode, target: string) => string

export interface DeepCopyingOptions {
  /** 需要扫描的代码路径 */
  source: string
  /** 目标文件路径 */
  target: string
  /** 转换文件内容的处理器 */
  handler?: DeepCopyingHandler
  /** 过滤文件（为true才执行，否则跳过） */
  filter?: DeepCopyingFilter
  /** 重定义目标文件名 */
  rename?: DeepCopyingRename
  /** 重定向源文件路径 */
  redirect?: DeepCopyingRedirect
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
}: DeepCopyingOptions) {
  const SPEC_FILE_EXP = /^_(.*\.\w+)_$/
  const __handler__ = async (node: DeepCopyingNode) => {
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

export async function deepCopyWithLoading(options: DeepCopyingOptions): Promise<void> {
  if (await pathExists(options.target)) {
    throw new WritingError(
      WritingError.DEEP_COPIED_TARGET_ALREADY_EXISTS,
      `Copied target ${options.target} already exists.`
    )
  }
  return printTask<string, void>({
    exitCode: WritingError.DEEP_COPY_FAILED,
    task: async ({ loading }) => {
      return deepCopy({
        ...options,
        handler: (node, content) => {
          loading(node.offset)
          if (options.handler) {
            return options.handler(node, content)
          } else {
            return content
          }
        }
      })
    },
    loading: payload => {
      return `Copying file ${magenta(payload)}.`
    },
    resolve: () => {
      return `Successfully copied files to ${green(options.target)}.`
    },
    reject: () => {
      return `Failed to copy files to ${red(options.target)}.`
    }
  })
}
