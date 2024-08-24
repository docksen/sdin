import { NodePath, PluginObj, PluginPass } from '@babel/core'
import { ImportOrExportDeclaration } from '@babel/types'
import { mapValues } from 'lodash'
import { resolve } from 'path'
import { aliasPosix, relativePosix } from 'utils/path'

export interface ModuleAliasBabelPluginOptions {
  /** 项目根目录 */
  root?: string
  /** 模块别名 */
  alias?: Record<string, string>
}

interface State extends PluginPass {
  opts: Record<string, any>
}

/**
 * 模块别名插件
 */
export function moduleAliasBabelPlugin(): PluginObj {
  return {
    name: 'module-alias',
    pre(this: State) {
      if (this.opts._init) {
        return
      }
      this.opts._init = true
      this.opts.root = this.opts.root ?? process.cwd()
      this.opts.alias = this.opts.alias ?? {}
      this.opts.resolvedAlias = mapValues(this.opts.alias, value => resolve(this.opts.root, value))
    },
    visitor: {
      ImportOrExportDeclaration: visitImportOrExportDeclaration
    }
  }
}

/**
 * 涉及以下场景：
 * import "source" (Import)
 * import { x } from "source" (Import)
 * import { x as y } from "source" (Import)
 * import { default as y } from 'source' (Import)
 * import x from "source" (ImportDefault)
 * import x, { x as y } from "source" (ImportDefault + ImportNamespace)
 * import * from "source" (ImportNamespace)
 * import * as y from "source" (ImportNamespace)
 * export { x } from 'source (ExportNamed)
 * export { x as y } from 'source (ExportNamed)
 * export { default as y } from 'source' (ExportNamed)
 * export * from 'source' (ExportAll)
 * export * as y from 'source' (ExportAll)
 */
function visitImportOrExportDeclaration(path: NodePath<ImportOrExportDeclaration>, state: State) {
  if (!('source' in path.node) || !path.node.source) {
    return
  }
  const mdlPath = path.node.source.value
  const curPath = state.file.opts.filename
  // 若没有引用文件，则不用处理
  if (!curPath || !mdlPath) {
    return
  }
  const target = aliasPosix(mdlPath, state.opts.resolvedAlias)
  // 若没有使用路径别名，则不用处理
  if (!target) {
    return
  }
  path.node.source.value = relativePosix(curPath, target)
}
