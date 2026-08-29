import { NodePath, PluginObj, PluginPass } from '@babel/core'
import { ImportOrExportDeclaration } from '@babel/types'
import { addSideEffect } from '@babel/helper-module-imports'

const SACSS_EXP = /\.(sass|scss)$/

export interface StyleModuleBabelPluginOptions {
  /** 在 JS 文件中引入转换后的 CSS 文件 */
  styleImports: boolean
}

interface State extends PluginPass {
  opts: Record<string, any>
}

/**
 * 样式模块插件
 */
export function styleModuleBabelPlugin(): PluginObj {
  return {
    name: 'sass-module',
    pre(this: State) {
      if (this.opts._init) {
        return
      }
      this.opts._init = true
      this.opts.styleImports = this.opts.styleImports ?? true
    },
    visitor: {
      ImportOrExportDeclaration: visitImportOrExportDeclaration
    }
  }
}

/**
 * 涉及以下场景：
 * import x from "source" (ImportDefault)
 * export { x } from 'source (ExportNamed)
 * export * as y from 'source' (ExportAll)
 */
function visitImportOrExportDeclaration(path: NodePath<ImportOrExportDeclaration>, state: State) {
  if (!('source' in path.node) || !path.node.source) {
    return
  }
  const mdlPath = path.node.source.value
  // 若不是 SASS 文件，则不用处理
  if (!mdlPath || !SACSS_EXP.test(mdlPath)) {
    return
  }
  const prePath = mdlPath.replace(SACSS_EXP, '')
  path.node.source.value = prePath + '.css.json'
  if (state.opts.styleImports) {
    addSideEffect(path, prePath + '.css')
  }
}
